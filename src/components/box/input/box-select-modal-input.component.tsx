import { useState } from "react";
import { Modal, Table, Input, Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { BoxDto } from "../../../models/box/box-dto.model"; // ajusta esta ruta si es diferente

interface BoxSelectModalInputProps {
  label?: string;
  value?: number;
  boxList: BoxDto[];
  onChange: (value: number | undefined) => void;
  required?: boolean;
}

export function BoxSelectModalInput({
  label,
  value,
  boxList,
  onChange,
  required = false,
}: BoxSelectModalInputProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);


  const handleSelect = (record: BoxDto) => {
    onChange(record.id);
    setVisible(false);
  };

  const columns = [
    {
      title: t("manageData.box.page.reference.label"),
      dataIndex: "reference",
      key: "reference",
    },
    {
      title: t("manageData.box.page.description.label"),
      dataIndex: "description",
      key: "description",
    }
  ];

  return (
    <div>
      <p style={{ marginBottom: 4 }}>{`${label}:`}</p>

      {boxList.find(b => b.id == value) == undefined ? (
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
          {t("manageData.selectBox")}
        </Button>
      ) : (
        <Space direction="vertical" style={{ display: "flex" }}>
          <Input.TextArea
            readOnly
            value={`${boxList.find(b => b.id == value)?.reference} - ${boxList.find(b => b.id == value)?.description}`}
            onClick={() => setVisible(true)}
            style={{ cursor: "pointer" }}
            required={required}
          />
          <Button
            danger
            onClick={() => {
              onChange(undefined);
            }}
            style={{ alignSelf: "flex-start", marginTop: 8 }}
          >
            {t("manageData.clearSelection")}
          </Button>
        </Space>
      )}

      <Modal
        title={t("manageData.selectBox")}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={900}
      >
        <Table
          columns={columns}
          dataSource={boxList}
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
