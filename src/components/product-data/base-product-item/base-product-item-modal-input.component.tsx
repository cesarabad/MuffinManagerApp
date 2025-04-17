import { useState } from "react";
import { Modal, Table, Input, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import { BaseProductItemDto } from "../../../models/product-data/base-product-item/base-product-item-dto.model";
import { MuffinShapeDto } from "../../../models/muffin-shape/muffin-shape-dto.model";

interface BaseProductItemSelectModalInputProps {
  label?: string;
  value?: number;
  baseProductItemList: BaseProductItemDto[];
  muffinShapeList: MuffinShapeDto[];
  onChange: (value: number | undefined) => void;
  required?: boolean;
}

export function BaseProductItemSelectModalInput({
  label,
  value,
  baseProductItemList,
  muffinShapeList,
  onChange,
  required = false,
}: BaseProductItemSelectModalInputProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);


  const handleSelect = (record: BaseProductItemDto) => {
    onChange(record.id);
    setVisible(false);
  };

  const formatProductLabel = (item?: BaseProductItemDto) => {
    if (!item) return "";
    const muffinShapeDesc = muffinShapeList?.find((shape) => shape.id === item.muffinShape)?.description || "-";
    return `${item.reference} - ${muffinShapeDesc} ${item.mainDescription} ${item.unitsPerItem ?? "-"} UDS`;
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
        record.muffinShape ? muffinShapeList?.find((m) => m.id == record.muffinShape)?.description || "-" : "-",
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

      {baseProductItemList.find(p => p.id == value) == undefined ? (
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
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Input.TextArea
            readOnly
            value={formatProductLabel(baseProductItemList.find(p => p.id == value))}
            onClick={() => setVisible(true)}
            style={{ cursor: "pointer", resize: "none" }}
            autoSize={{ minRows: 1, maxRows: 3 }}
            required={required}
          />

          <Button
            danger
            onClick={() => {
              onChange(undefined);
            }}
          >
            {t("manageData.clearSelection")}
          </Button>
        </div>
      )}

      <Modal
        title={t("manageData.selectBaseProductItem")}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={900}
      >
        <Table
          columns={columns}
          dataSource={baseProductItemList}
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
