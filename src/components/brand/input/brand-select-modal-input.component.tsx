import { useState, useEffect } from "react";
import { Modal, Table, Input, Button, Space, Image } from "antd";
import { BrandDto } from "../../../models/brand/brand-dto.model";
import { brandService } from "../../../services/manage-data/brand.service";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";
import { useWebSocketListener } from "../../../services/web-socket-listenner.service";

interface BrandSelectModalInputProps {
  label?: string;
  value?: number; // ID de la marca seleccionada
  onChange: (value: number | undefined) => void;
  required?: boolean;
}

export function BrandSelectModalInput({
    label,
    value,
    onChange,
    required = false,
  }: BrandSelectModalInputProps) {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [brandList, setBrandList] = useState<BrandDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<BrandDto | undefined>(undefined);
    const fetchBrands = async () => {
      setLoading(true);
      try {
        await brandService.getAll().then((brands) => {
            setSelectedBrand(brands.find((b) => b.id === value));
            setBrandList(brands);
        });
      } catch (err) {
        console.error("Error loading brands:", err);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
        fetchBrands();
    },[])
    
    useWebSocketListener(`/topic${brandService.getPath()}`, fetchBrands);
  
    useEffect(() => {
        if (value === undefined || brandList.length === 0) {
          setSelectedBrand(undefined);
          return;
        }
      
        const current = brandList.find((b) => b.id === value);
        if (current) {
            setSelectedBrand(current);
        }
        
    }, [value, brandList]);
      
      
  
    const handleSelect = (record: BrandDto) => {
      onChange(record.id);
      setSelectedBrand(record);
      setVisible(false);
    };
  
    const columns = [
      {
        title: t("manageData.brand.page.reference.label"),
        dataIndex: "reference",
        key: "reference",
      },
      {
        title: t("manageData.brand.page.name.label"),
        dataIndex: "name",
        key: "name",
      },
      {
        title: t("manageData.brand.page.aliasVersion.label"),
        dataIndex: "aliasVersion",
        key: "aliasVersion",
      },
      {
        title: t("manageData.brand.page.logo.label"),
        dataIndex: "logoBase64",
        key: "logo",
        render: (logoBase64: string) => (
          <Image width={50} src={`data:image/png;base64,${logoBase64}`} alt="logo" />
        ),
      },
    ];
  
    return (
      <div>
        <p style={{ marginBottom: 4 }}>
          {`${label}:`}
        </p>
  
        {!selectedBrand ? (
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
                {t("manageData.selectBrand")}
            </Button>
            ) : (
            <Space direction="vertical" style={{ display: "flex" }}>
                <Space style={{ display: "flex", alignItems: "center" }}>
                  <Input
                    readOnly
                    value={selectedBrand.name ?? undefined}
                    onClick={() => setVisible(true)}
                    style={{ cursor: "pointer", flex: 1 }}
                    required={required}
                  />
                  {selectedBrand.logoBase64 ? (
                    <Image
                      src={`data:image/png;base64,${selectedBrand.logoBase64}`}
                      alt="logo"
                      height={40}
                      preview={false}
                    />
                  ) : null}
                </Space>
              
                <Button
                    danger
                    onClick={() => {
                        onChange(-1);
                        setSelectedBrand(undefined);
                    }}
                    style={{ alignSelf: "flex-start", marginTop: 8 }}
                    >
                    {t("manageData.clearSelection") || "Quitar selección"}
                </Button>

            </Space>
              
        )}

  
        <Modal
          title={t("manageData.selectBrand")}
          open={visible}
          onCancel={() => setVisible(false)}
          footer={null}
          width={800}
        >
          <Table
            loading={loading}
            columns={columns}
            dataSource={brandList}
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
  