import { useState } from "react";
import { Modal, Table, Input, Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { ProductItemDto } from "../../../models/product-data/product-item/product-item-dto.model";

interface ProductItemSelectModalInputProps {
  label?: string;
  value?: number;
  productItemList: ProductItemDto[];
  onChange: (value: number | undefined) => void;
  required?: boolean;
}

export function ProductItemSelectModalInput({
  label,
  value,
  productItemList,
  onChange,
  required = false,
}: ProductItemSelectModalInputProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);


  const handleSelect = (record: ProductItemDto) => {
    onChange(record.id);
    setVisible(false);
  };

  const columns = [
    {
      title: t("manageData.productData.product.page.productItem.label"),
      dataIndex: "productItemInfo",
      key: "productItemInfo",
    },
    {
      title: t("manageData.productData.product.page.aliasVersion.label"),
      dataIndex: "aliasVersion",
      key: "aliasVersion",
    },
  ];

  return (
    <div>
      <p style={{ marginBottom: 4 }}>{`${label}:`}</p>

      {productItemList.find((p) => p.id == value) == undefined ? (
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
          {t("manageData.selectProductItem")}
        </Button>
      ) : (
        <Space direction="vertical" style={{ display: "flex" }}>
          <Input.TextArea
            readOnly
            value={
              productItemList.find((p) => p.id == value)
          ? `${productItemList.find((p) => p.id == value)!.productItemInfo || ""}${
              productItemList.find((p) => p.id == value)!.aliasVersion
                ? ` (${productItemList.find((p) => p.id == value)!.aliasVersion})`
                : ""
            }`
          : ""
            }
            onClick={() => setVisible(true)}
            style={{ cursor: "pointer" }}
            required={required}
          />
          <Button
            danger
            onClick={() => onChange(undefined)}
            style={{ alignSelf: "flex-start", marginTop: 8 }}
          >
            {t("manageData.clearSelection")}
          </Button>
        </Space>
      )}

    <Modal
      title={t("manageData.selectProductItem")}
      open={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      width={900}
    >
      <Table
        columns={columns}
        dataSource={productItemList}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
        onClick: () => handleSelect(record),
        })}
        rowClassName={() => "clickable-row"}
        scroll={{ x: "max-content" }}
      />
    </Modal>
    </div>
  );
}
