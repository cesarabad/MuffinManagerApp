import { Select } from 'antd';
import { SelectProps } from 'antd/es/select';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface GenericSelectProps<T> extends Omit<SelectProps<string>, 'options' | 'onChange'> {
  label?: string;
  required?: boolean;
  data: T[];
  valueField: keyof T;
  labelField: keyof T;
  value?: string;
  onChange: (value: string) => void;
}

export function GenericSelect<T>({
  label,
  required,
  data,
  valueField,
  labelField,
  value,
  onChange,
  ...rest
}: GenericSelectProps<T>) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation();
  const handleChange = (val: string) => {
    if (required && !val) {
      setErrorMessage(t('validation.required'));
    } else {
      setErrorMessage(null);
    }
    onChange(val);
  };
  return (
    <div>
      <p style={{ marginBottom: 0 }}>
        {label}: {required && '*'}
      </p>
      
      <Select
        {...rest}
        value={value ?? "-1"}
        onChange={handleChange}
        options={[
          { value: "-1", label: t('button.select') },
          ...data.map((item) => ({
            value: Number(item[valueField] ?? ""),
            label: String(item[labelField] ?? ""),
          })),
        ]}
        style={{ width: '100%' }}
            />
            {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
    </div>
  );
}
