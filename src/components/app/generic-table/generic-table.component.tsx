import { Table, Button, Popconfirm, Space, Select, Radio, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { GenericDto } from "../../../models/generic-version-model/generic-version-dto.model";
import { GET_ALL, GET_OBSOLETES } from "../generic-crud-manager-page/generic-crud-manager-page.component";
import { t } from "i18next";
import { useState } from "react";

const { Option } = Select;
const { Text } = Typography;

interface GenericTableProps<T extends GenericDto> {
  data: T[];
  loading: boolean;
  manageVersions?: boolean;
  onEdit: (item: T) => void;
  onDelete: (item: T, selectedOption: string) => void;
  onChange: (item: string) => void;
  extraColumns?: ColumnsType<T>;
}

export function GenericTable<T extends GenericDto>({
  data,
  loading,
  manageVersions = false,
  onEdit,
  onDelete,
  onChange,
  extraColumns = [],
}: GenericTableProps<T>) {
  const [deleteOptions, setDeleteOptions] = useState<{ [key: string]: string }>({});

  const handleDeleteOptionChange = (recordId: string, value: string) => {
    setDeleteOptions((prev) => ({ ...prev, [recordId]: value }));
  };

  const columns: ColumnsType<T> = [
    ...(extraColumns ?? []),
    {
      title: t("manageData.modify"),
      key: "actions",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />

          <Popconfirm
            title={
              <div style={{ maxWidth: 300 }}>
                <Text>{t("manageData.askDelete")}</Text>
                {manageVersions && (
                  <Radio.Group
                    onChange={(e) => record.id && handleDeleteOptionChange(String(record.id), e.target.value)}
                    defaultValue="this-version"
                    style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    <Radio value="this-version">{t("manageData.modal.actualVersion")}</Radio>
                    <Radio value="full-reference">{t("manageData.modal.allReference")}</Radio>
                  </Radio.Group>
                )}
              </div>
            }
            onConfirm={() => record.id && onDelete(record, deleteOptions[record.id] || "this-version")}
            okText={t("button.yes")}
            cancelText={t("button.no")}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {manageVersions && (
        <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <Text strong>{t("manageData.table.selectVersion")}:</Text>
          <Select
            defaultValue={GET_ALL}
            style={{ width: 220 }}
            onChange={(value) => onChange(value)}
          >
            <Option value={GET_ALL}>{t("manageData.table.activesOption")}</Option>
            <Option value={GET_OBSOLETES}>{t("manageData.table.obsoletesOption")}</Option>
          </Select>
        </div>
      )}

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
        bordered
      />
    </div>
  );
}
