import { useState, useEffect } from "react";
import { Modal, Table, Input, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import { BaseProductItemDto } from "../../../models/product-data/base-product-item/base-product-item-dto.model";
import { baseProductItemService } from "../../../services/manage-data/product-tada/base-product-item.service";
import { muffinShapeService } from "../../../services/manage-data/muffin-shape.service";

interface BaseProductItemSelectModalInputProps {
  label?: string;
  value?: number;
  onChange: (value: number | undefined) => void;
  required?: boolean;
}

export function BaseProductItemSelectModalInput({
  label,
  value,
  onChange,
  required = false,
}: BaseProductItemSelectModalInputProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [productList, setProductList] = useState<BaseProductItemDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<BaseProductItemDto | undefined>(undefined);
  const [muffinDescriptions, setMuffinDescriptions] = useState<Record<number, string>>({});

  const fetchMuffinDescriptions = async (products: BaseProductItemDto[]) => {
    const muffinIds = Array.from(new Set(products.map(p => p.muffinShape).filter(Boolean))) as number[];
    const entries = await Promise.all(
      muffinIds.map(async (id) => {
        try {
          const muffin = await muffinShapeService.getById(id);
          return [id, muffin.description] as [number, string];
        } catch {
          return [id, "-"] as [number, string];
        }
      })
    );
    setMuffinDescriptions(Object.fromEntries(entries));
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const products = await baseProductItemService.getAll();
      setProductList(products);
      await fetchMuffinDescriptions(products);
      const current = products.find((p) => p.id === value);
      setSelectedProduct(current);
    } catch (err) {
      console.error("Error loading base product items or muffin shapes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (value === undefined || productList.length === 0) {
      setSelectedProduct(undefined);
      return;
    }

    const current = productList.find((p) => p.id === value);
    if (current) {
      setSelectedProduct(current);
    }
  }, [value, productList]);

  const handleSelect = (record: BaseProductItemDto) => {
    onChange(record.id);
    setSelectedProduct(record);
    setVisible(false);
  };

  const formatProductLabel = (item?: BaseProductItemDto) => {
    if (!item) return "";
    const muffin = item.muffinShape ? muffinDescriptions[item.muffinShape] || "-" : "-";
    return `${muffin} ${item.mainDescription} ${item.unitsPerItem ?? "-"} UDS`;
  };

  const columns = [
    {
      title: t("manageData.productData.baseProductItem.page.reference.label"),
      dataIndex: "reference",
      key: "reference",
    },
    {
      title: t("manageData.productData.baseProductItem.page.muffinShape.label"),
      key: "muffinShape",
      render: (_: any, record: BaseProductItemDto) =>
        record.muffinShape ? muffinDescriptions[record.muffinShape] || "-" : "-",
    },
    {
      title: t("manageData.productData.baseProductItem.page.mainDescription.label"),
      dataIndex: "mainDescription",
      key: "mainDescription",
    },
    {
      title: t("manageData.productData.baseProductItem.page.unitsPerItem.label"),
      dataIndex: "unitsPerItem",
      key: "unitsPerItem",
    },
  ];

  return (
    <div>
      <p style={{ marginBottom: 4 }}>
        {label}:
      </p>

      {!selectedProduct ? (
        <Button
          icon={<PlusOutlined />}
          onClick={() => setVisible(true)}
          style={{
            width: "100%",
            backgroundColor: "#cce7ff",
            border: "1px solid #69b1ff",
            color: "#1677ff",
            fontWeight: "500",
            transition: "background-color 0.3s ease",
          }}
          type="default"
          onMouseEnter={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#a3d3ff")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#cce7ff")
          }
        >
          {t("manageData.selectBaseProductItem")}
        </Button>
      ) : (
        <>
          <Input
            readOnly
            value={formatProductLabel(selectedProduct)}
            onClick={() => setVisible(true)}
            style={{ cursor: "pointer", flex: 1 }}
            required={required}
          />

          <Button
            danger
            onClick={() => {
              onChange(undefined);
              setSelectedProduct(undefined);
            }}
            style={{ marginTop: 8 }}
          >
            {t("manageData.clearSelection") || "Quitar selección"}
          </Button>
        </>
      )}

      <Modal
        title={t("manageData.selectProduct")}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={900}
      >
        <Table
          loading={loading}
          columns={columns}
          dataSource={productList}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          onRow={(record) => ({
            onClick: () => handleSelect(record),
          })}
          rowClassName={() => "clickable-row"}
        />
      </Modal>
    </div>
  );
}
