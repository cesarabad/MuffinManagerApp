import { Table, Button, Popconfirm, Space } from "antd";
import { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { GenericDto } from "../../../models/generic-version-model/generic-version-dto.model";

interface GenericTableProps<T extends GenericDto> {
  data: T[];
  loading: boolean;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  extraColumns?: ColumnsType<T>;
}

export function GenericTable<T extends GenericDto>({
  data,
  loading,
  onEdit,
  onDelete,
  extraColumns = [],
}: GenericTableProps<T>) {
  const columns: ColumnsType<T> = [
    ...(extraColumns ?? []),
    {
      title: "Acciones",
      key: "actions",
      fixed: "right", // Fija esta columna a la derecha
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Popconfirm
            title="¿Eliminar este elemento?"
            onConfirm={() => onDelete(record)}
            okText="Sí"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={{ pageSize: 5 }}
      scroll={{ x: "max-content"}} // Permite scroll horizontal y vertical
    />
  );
}
