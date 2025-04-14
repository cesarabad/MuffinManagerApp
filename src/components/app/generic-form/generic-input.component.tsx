import { Input, InputProps } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { InputHTMLAttributes, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface GenericInputProps<T extends HTMLInputElement> extends InputHTMLAttributes<T> {
    label?: string;
}

export function GenericInput<T extends HTMLInputElement>({ ...props }: GenericInputProps<T>) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { t } = useTranslation();

    const validate = (value: string) => {
        if (props.required && !value) {
            setErrorMessage(t('validation.required'));
            return;
        }
        if (props.minLength && value.length < props.minLength) {
            setErrorMessage(t('validation.minLength', { min: props.minLength }));
            return;
        }
        if (props.maxLength && value.length > props.maxLength) {
            setErrorMessage(t('validation.maxLength', { max: props.maxLength }));
            return;
        }
        if (props.pattern && !new RegExp(props.pattern.toString()).test(value)) {
            setErrorMessage(t('validation.pattern'));
            return;
        }
        if (props.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setErrorMessage(t('validation.email'));
            return;
        }
        if (props.type === 'number' && (isNaN(Number(value)))) {
            setErrorMessage(t('validation.number'));
            return;
        }
        setErrorMessage(null);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        validate(e.target.value);
        props.onBlur?.(e as React.FocusEvent<T>);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (props.type === 'number' &&
          (["e", "E", "+", "-"].includes(e.key) ||
          (e.key === "." && (props.value?.toString().includes(".") || props.value?.toString().length === 0 || props.inputMode === "numeric")))
        ) {
          e.preventDefault();
        }
      
        props.onKeyDown?.(e as React.KeyboardEvent<T>);
      };
      
    return (
        <>
          <p style={{ marginBottom: 0 }}>{`${props.label ? props.label : props.placeholder}:`}</p>
          {props.type === 'textarea' ? (
            <TextArea {...(props as Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onResize'>)} onBlur={handleBlur} onKeyDown={handleKeyDown} />
          ) : (
            <Input {...(props as InputProps)} onBlur={handleBlur} onKeyDown={handleKeyDown} />
          )}
          {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
        </>
      );
      
}
