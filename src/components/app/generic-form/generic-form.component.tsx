import { ReactNode } from "react";
import { Input, Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { GenericDto } from "../../../models/generic-version-model/generic-version-dto.model";

interface GenericFormProps<T extends GenericDto> {
  item: T | null;
  onChange: (field: keyof T, value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  children?: ReactNode; // Campos adicionales (como descripción, precios, etc.)
}

export function GenericForm<T extends GenericDto>({
  item,
  onChange,
  onSubmit,
  onReset,
  children,
}: GenericFormProps<T>) {
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Input
        placeholder="Referencia"
        value={item?.reference || ""}
        onChange={(e) => onChange("reference", e.target.value)}
      />
      {children}
      <Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onSubmit}
        >
          {item?.id ? "Actualizar" : "Añadir"}
        </Button>
        <Button onClick={onReset}>Cancelar</Button>
      </Space>
    </Space>
  );
}
