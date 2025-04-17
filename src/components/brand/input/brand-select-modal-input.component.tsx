import { useState } from "react";
import { Modal, Table, Input, Button, Space, Image } from "antd";
import { BrandDto } from "../../../models/brand/brand-dto.model";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";

interface BrandSelectModalInputProps {
  label?: string;
  value?: number;
  brandList: BrandDto[];
  onChange: (value: number | undefined) => void;
  required?: boolean;
}

export function BrandSelectModalInput({
    label,
    value,
    brandList,
    onChange,
    required = false,
  }: BrandSelectModalInputProps) {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
  
    const handleSelect = (record: BrandDto) => {
      onChange(record.id);
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
          <Image width={50} src={`data:image/png;base64,${logoBase64}`} alt="logo" preview={false}/>
        ),
      },
    ];
  
    return (
      <div>
        <p style={{ marginBottom: 4 }}>
          {`${label}:`}
        </p>
  
        {brandList.find(b => b.id == value) == undefined ? (
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
                    value={brandList.find(b => b.id == value)?.name ?? undefined}
                    onClick={() => setVisible(true)}
                    style={{ cursor: "pointer", flex: 1 }}
                    required={required}
                  />
                  {brandList.find(b => b.id == value)?.logoBase64 ? (
                    <Image
                      src={`data:image/png;base64,${brandList.find(b => b.id == value)?.logoBase64}`}
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
                    }}
                    style={{ alignSelf: "flex-start", marginTop: 8 }}
                    >
                    {t("manageData.clearSelection")}
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
  