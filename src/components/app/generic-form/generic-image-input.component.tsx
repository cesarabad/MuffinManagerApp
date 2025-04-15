import { useRef, useState, useEffect } from "react";
import { Button, Image, Space } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface GenericImageInputProps {
  label?: string;
  value?: string; // valor base64
  onChange: (base64Image: string | null) => void;
}

export function GenericImageInput({ label, value, onChange }: GenericImageInputProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { t } = useTranslation();

  // Si llega un valor base64 y no hay preview aún, mostrarlo
  useEffect(() => {
    if (!value) {
      setPreviewUrl(null); // limpiar preview si no hay valor
      return;
    }
  
    const blob = b64toBlob(value);
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
  
    // Limpieza del objeto URL cuando cambia o se desmonta
    return () => URL.revokeObjectURL(url);
  }, [value]);
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview en binario
    const blobUrl = URL.createObjectURL(file);
    setPreviewUrl(blobUrl);

    // Convertir a base64 y enviar al padre
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result?.toString().split(',')[1]; // solo datos base64 sin el prefix
      if (base64) {
        onChange(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const b64toBlob = (b64Data: string, contentType = "image/png") => {
    const byteCharacters = atob(b64Data);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <p style={{ marginBottom: 0 }}>{label}:</p>
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Space>
        <Button icon={<UploadOutlined />} onClick={() => fileInputRef.current?.click()}>
          {t("button.browse")}
        </Button>
        {previewUrl && (
          <Button danger icon={<DeleteOutlined />} onClick={handleRemoveImage}>
            {t("button.remove")}
          </Button>
        )}
      </Space>
      {previewUrl && (
        <Image
          src={previewUrl}
          alt="preview"
          width={200}
          height="auto"
          style={{ border: "1px solid #ddd", marginTop: 8 }}
        />
      )}
    </div>
  );
}
