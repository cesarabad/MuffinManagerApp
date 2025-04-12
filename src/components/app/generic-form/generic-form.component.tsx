import { ReactNode, useState, useEffect, useRef } from "react";
import { Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { GenericDto } from "../../../models/generic-version-model/generic-version-dto.model";
import { useTranslation } from "react-i18next";

interface GenericFormProps<T extends GenericDto> {
  item: T | null;
  onChange: (field: keyof T, value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  children?: ReactNode; // Campos adicionales (como descripción, precios, etc.)
}

export function GenericForm<T extends GenericDto>({
  item,
  onSubmit,
  onReset,
  children,
}: GenericFormProps<T>) {
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const formRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const validateForm = () => {
    if (!formRef.current) return false;

    const inputs = formRef.current.querySelectorAll("input");
    for (const input of inputs) {
      if (input.required && !input.value.trim()) {
        return false;
      }
      if (input.minLength && input.minLength > 0 && input.value.length < input.minLength) {
        return false;
      }
      if (input.maxLength && input.maxLength > 0 && input.value.length > input.maxLength) {
        return false;
      }
      if (input.pattern && input.pattern.trim()) {
        const regex = new RegExp(input.pattern);
        if (!regex.test(input.value)) {
          return false;
        }
      }
    }
    return true;
  };

  useEffect(() => {
    setIsSubmitDisabled(!validateForm());
  }, [item]);

  return (
    <Space direction="vertical" style={{ width: "100%" }} ref={formRef}>
      
      {children}
      <Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onSubmit}
          disabled={isSubmitDisabled} // Deshabilitar el botón si no pasa la validación
        >
          {item?.id ? t('button.edit') : t('button.add')}
        </Button>
        <Button onClick={onReset}>{t('button.clean')}</Button>
      </Space>
    </Space>
  );
}
