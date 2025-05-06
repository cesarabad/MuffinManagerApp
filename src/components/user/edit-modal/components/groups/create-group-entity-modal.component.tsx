import React, { useState, useEffect } from "react";
import { 
  Modal as AntModal, 
  Form, 
  Input, 
  Checkbox, 
  Button, 
  Row, 
  Col, 
  Spin, 
  Typography, 
  Space, 
  Alert, 
  Tag, 
  Divider,
  Card,
  theme
} from "antd";
import { useTranslation } from "react-i18next";
import { userService } from "../../../../../services/user/user.service";
import { toast } from "react-toastify";
import styled from "styled-components";
import { 
  SafetyOutlined,
  TeamOutlined,
  EditOutlined,
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
  LockOutlined
} from '@ant-design/icons';
import { GroupedPermissions, GroupEntity, Permission, PermissionEntity } from "../../../../../models/index.model";

interface CreateGroupEntityModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  groupToEdit?: GroupEntity | null;
  availablePermissions: PermissionEntity[];
  loading: boolean;
}

const { Title, Text } = Typography;
const { useToken } = theme;

// Styled components para mejorar la apariencia
const StyledModal = styled(AntModal)`
  .ant-modal-content {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.15);
    width: 100%;
  }

  .ant-modal-body {
    padding: 24px 24px 16px;
    width: 100%;
  }

  .ant-modal-header {
    padding: 20px 24px;
    width: 100%;
    border-bottom: 1px solid #f0f0f0;
  }

  .ant-modal-title {
    font-size: 20px;
  }

  .ant-form-item-label > label {
    font-size: 16px;
    height: auto;
  }

  .ant-checkbox-wrapper {
    font-size: 15px;
    transition: all 0.2s ease;
  }

  .ant-checkbox {
    transform: scale(1.1);
  }

  .permissions-container {
    scrollbar-width: thin;
    scrollbar-color: #d9d9d9 #f5f5f5;
  }

  .permissions-container::-webkit-scrollbar {
    width: 6px;
  }

  .permissions-container::-webkit-scrollbar-track {
    background: #f5f5f5;
    border-radius: 10px;
  }

  .permissions-container::-webkit-scrollbar-thumb {
    background-color: #d9d9d9;
    border-radius: 10px;
    border: 2px solid #f5f5f5;
  }

  .permissions-container::-webkit-scrollbar-thumb:hover {
    background-color: #bfbfbf;
  }

  .permission-card {
    transition: transform 0.2s ease, box-shadow 0.3s ease;
    border-radius: 12px;
    width: 100% !important;
  }

  .permission-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .ant-tag {
    transition: all 0.2s;
    border: none;
  }

  .ant-checkbox-wrapper:hover .ant-tag {
    transform: translateX(3px);
  }

  .ant-form, .ant-form-item, .ant-row, .ant-col-24 {
    width: 100%;
  }

  @media (min-width: 1400px) {
    width: 80% !important;
    max-width: 1200px;
    
    .permissions-container {
      max-height: 650px !important;
    }
  }

  @media (min-width: 992px) and (max-width: 1399px) {
    width: 85% !important;
    max-width: 1000px;
    
    .permissions-container {
      max-height: 550px !important;
    }
  }

  @media (min-width: 768px) and (max-width: 991px) {
    width: 90% !important;
    
    .permissions-container {
      max-height: 500px !important;
    }
  }

  @media (max-width: 767px) {
    width: 95% !important;
    
    .permissions-container {
      max-height: 450px !important;
    }
  }
`;

const StyledCard = styled(Card)<{ headColor?: string }>`
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  border-radius: 12px;
  width: 100% !important;
  overflow: hidden;
  border: none;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  .ant-card-head {
    min-height: 0;
    padding: 16px 20px;
    border-bottom: none;
    background-color: ${props => props.headColor || 'rgba(24, 144, 255, 0.08)'};
  }

  .ant-card-body {
    padding: 16px 20px;
  }
`;

const StyledTag = styled(Tag)`
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 14px;
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 100%;
  margin-right: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StyledButton = styled(Button)`
  border-radius: 8px;
  height: auto;
  padding: 8px 16px;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &.ant-btn-primary {
    font-weight: 500;
  }
`;

const SubgroupHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  width: 100%;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 6px;
  width: 100%;
`;

const PermissionsContainer = styled.div`
  max-height: 500px;
  overflow-y: auto;
  padding: 0;
  width: 100%;
  scrollbar-width: thin;
  scrollbar-color: #f0f0f0 #fff;
`;

const FooterActions = styled.div`
  margin-top: 32px;
  padding: 20px 0;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  width: 100%;
`;

const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const CreateGroupEntityModal: React.FC<CreateGroupEntityModalProps> = ({
  open,
  onClose,
  onSuccess,
  groupToEdit,
  availablePermissions,
  loading
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { token } = useToken();
  
  // Determine if we're in edit mode
  const isEditMode = !!groupToEdit;

  // Function to get permission color based on group name
  const getPermissionColor = (groupName: string): string => {
    const colors: Record<string, string> = {
      data: "blue",
      products: "cyan",
      stock: "green",
      users: "orange",
      role: "red",
      general: "purple",
      other: "default"
    };
    return colors[groupName] || "default";
  };
  
  // Function to convert color name to rgba background color
  const getBackgroundColor = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      blue: `rgba(24, 144, 255, 0.08)`,
      cyan: `rgba(45, 183, 245, 0.08)`,
      green: `rgba(82, 196, 26, 0.08)`,
      orange: `rgba(250, 173, 20, 0.08)`,
      red: `rgba(245, 34, 45, 0.08)`,
      purple: `rgba(114, 46, 209, 0.08)`,
      default: `rgba(0, 0, 0, 0.02)`
    };
    return colorMap[colorName] || colorMap.default;
  };

  useEffect(() => {
    if (open) {
      // Reset form and set initial values if in edit mode
      form.resetFields();
      if (isEditMode && groupToEdit) {
        form.setFieldsValue({
          name: groupToEdit.name,
          permissionIds: groupToEdit.permissions.map(p => p.id)
        });
      }
    }
  }, [open, form, isEditMode, groupToEdit]);

  const handleSubmit = async (values: { name: string; permissionIds: number[] }) => {
    try {
      setSubmitting(true);
      
      // Create the new group entity with selected permissions
      const selectedPermissions = availablePermissions.filter(permission =>
        values.permissionIds.includes(permission.id)
      );
      
      const groupData: GroupEntity = {
        id: isEditMode && groupToEdit ? groupToEdit.id : 0,
        name: values.name,
        permissions: selectedPermissions
      };
      
      if (isEditMode) {
        await userService.saveGroupEntity(groupData);
        toast.success(t("success.groupUpdated"));
      } else {
        await userService.saveGroupEntity(groupData);
        toast.success(t("success.groupCreated"));
      }
      
      form.resetFields();
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} group:`, error);
      toast.error(t(isEditMode ? "error.updatingGroup" : "error.creatingGroup"));
    } finally {
      setSubmitting(false);
    }
  };

  // Create a map of permission names to IDs
  const getPermissionNameMap = (): Map<string, number> => {
    const permissionNameMap = new Map<string, number>();
    availablePermissions.forEach(p => {
      permissionNameMap.set(p.name, p.id);
    });
    return permissionNameMap;
  };

  const renderPermissionGroups = () => {
    const permissionNameMap = getPermissionNameMap();
    
    // Track rendered permissions to avoid duplicates
    const renderedPermissions = new Set<string>();

    return Object.entries(GroupedPermissions).map(([groupKey, groupValue]) => {
      const hasSubGroups = !Array.isArray(groupValue);
      const groupColor = getPermissionColor(groupKey);
      const backgroundColor = getBackgroundColor(groupColor);

      return (
        <StyledCard 
          key={groupKey}
          headColor={backgroundColor}
          title={
            <GroupHeader>
              <SafetyOutlined 
                style={{ 
                  marginRight: 10, 
                  color: groupColor === 'default' ? token.colorPrimary : undefined,
                  fontSize: 20 
                }} 
              />
              <Text strong style={{ fontSize: 18 }}>
                {t(`permission.category.${groupKey}`)}
              </Text>
            </GroupHeader>
          }
        >
          {hasSubGroups ? (
            Object.entries(groupValue as Record<string, Permission[]>).map(([subGroupKey, permissions]) => (
              <div key={subGroupKey} style={{ marginBottom: 20, width: '100%' }}>
                <SubgroupHeader>
                  <LockOutlined style={{ 
                    marginRight: 10, 
                    color: getPermissionColor(subGroupKey), 
                    fontSize: 18 
                  }} />
                  <Text style={{ fontWeight: 500, fontSize: 16 }}>
                    {t(`permissionGroup.${subGroupKey}`)}
                  </Text>
                </SubgroupHeader>
                <Row gutter={[16, 16]} style={{ width: '100%' }}>
                  {permissions.map((permission) => {
                    // Skip if we've already rendered this permission
                    if (renderedPermissions.has(permission)) return null;
                    renderedPermissions.add(permission);
                    
                    const permId = permissionNameMap.get(permission);
                    if (!permId) return null;
                    
                    return (
                      <Col key={permission} xs={24} sm={12} md={8} lg={8} xl={6} style={{ width: '100%' }}>
                        <CheckboxContainer>
                          <Checkbox
                            value={permId}
                            checked={form.getFieldValue('permissionIds')?.includes(permId)}
                            onChange={(e) => {
                              const currentPermissionIds = form.getFieldValue('permissionIds') || [];
                              const isChecked = e.target.checked;
                              const newPermissionIds = isChecked
                                ? [...currentPermissionIds, permId]
                                : currentPermissionIds.filter((id: number) => id !== permId);
                              form.setFieldsValue({ permissionIds: newPermissionIds });
                              form.validateFields(['permissionIds']);
                            }}
                          >
                            <StyledTag color={getPermissionColor(subGroupKey)}>
                              {t(`permission.${permission}`)}
                            </StyledTag>
                          </Checkbox>
                        </CheckboxContainer>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            ))
          ) : (
            <Row gutter={[16, 16]} style={{ width: '100%' }}>
              {(groupValue as Permission[]).map((permission) => {
                // Skip if we've already rendered this permission
                if (renderedPermissions.has(permission)) return null;
                renderedPermissions.add(permission);
                
                const permId = permissionNameMap.get(permission);
                if (!permId) return null;
                
                return (
                  <Col key={permission} xs={24} sm={12} md={8} lg={8} xl={6}>
                    <CheckboxContainer>
                      <Checkbox
                        value={permId}
                        checked={form.getFieldValue('permissionIds')?.includes(permId)}
                        onChange={(e) => {
                          const currentPermissionIds = form.getFieldValue('permissionIds') || [];
                          const isChecked = e.target.checked;
                          const newPermissionIds = isChecked
                            ? [...currentPermissionIds, permId]
                            : currentPermissionIds.filter((id: number) => id !== permId);
                          form.setFieldsValue({ permissionIds: newPermissionIds });
                          form.validateFields(['permissionIds']);
                        }}
                      >
                        <StyledTag color={getPermissionColor(groupKey)}>
                          {t(`permission.${permission}`)}
                        </StyledTag>
                      </Checkbox>
                    </CheckboxContainer>
                  </Col>
                );
              })}
            </Row>
          )}
        </StyledCard>
      );
    });
  };

  return (
    <StyledModal
      title={
        <Space align="center">
          {isEditMode ? (
            <EditOutlined style={{ fontSize: 22, color: token.colorPrimary }} />
          ) : (
            <PlusOutlined style={{ fontSize: 22, color: token.colorPrimary }} />
          )}
          <Title level={4} style={{ margin: 0, fontSize: 20 }}>
            {isEditMode ? t("profile.editGroup") : t("profile.createGroup")}
          </Title>
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width="auto"
      centered
      destroyOnClose
      style={{ top: 20 }}
      maskStyle={{ backdropFilter: 'blur(4px)' }}
    >
      <Spin spinning={loading} size="large">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ permissionIds: [] }}
          requiredMark="optional"
          size="large"
          style={{ width: '100%' }}
        >
          <Row gutter={16} style={{ width: '100%' }}>
            <Col span={24} style={{ width: '100%' }}>
              <Form.Item
                name="name"
                label={<Space><TeamOutlined style={{fontSize: 18}} />{t("profile.groupName")}</Space>}
                rules={[{ required: true, message: t("validation.required") }]}
              >
                <Input 
                  placeholder={t("profile.groupNamePlaceholder")} 
                  maxLength={50}
                  showCount
                  size="large"
                  style={{ 
                    borderRadius: 8, 
                    fontSize: 16, 
                    padding: '12px 16px', 
                    height: 'auto', 
                    width: '100%',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.03)',
                    border: '1px solid #d9d9d9'
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider style={{ margin: '24px 0 20px', width: '100%' }}>
            <Space size="small">
              <LockOutlined style={{ fontSize: 18 }} />
              <Text type="secondary" style={{ fontSize: 16 }}>{t("profile.permissionsLabel")}</Text>
            </Space>
          </Divider>

          {availablePermissions.length > 0 ? (
            <Form.Item
              name="permissionIds"
              label={<Space><SafetyOutlined style={{fontSize: 18}} />{t("profile.selectPermissions")}</Space>}
              rules={[{ 
                required: true, 
                message: t("validation.selectAtLeastOne"),
                type: 'array',
                min: 1
              }]}
              style={{ width: '100%' }}
            >
              <Checkbox.Group style={{ width: '100%' }}>
                <PermissionsContainer className="permissions-container">
                  {renderPermissionGroups()}
                </PermissionsContainer>
              </Checkbox.Group>
            </Form.Item>
          ) : (
            <Alert
              message={t("permission.noPermissionsAvailable")}
              type="warning"
              showIcon
              style={{ 
                marginBottom: 24, 
                borderRadius: 10, 
                padding: '12px 16px', 
                fontSize: 16, 
                width: '100%',
                boxShadow: '0 2px 8px rgba(250, 173, 20, 0.12)'
              }}
            />
          )}

          <FooterActions>
            <StyledButton 
              onClick={onClose}
              size="large"
              icon={<CloseOutlined />}
            >
              {t("button.cancel")}
            </StyledButton>
            <StyledButton
              type="primary"
              htmlType="submit"
              loading={submitting}
              size="large" 
              icon={<CheckOutlined />}
            >
              {isEditMode ? t("button.update") : t("button.create")}
            </StyledButton>
          </FooterActions>
        </Form>
      </Spin>
    </StyledModal>
  );
};

export default CreateGroupEntityModal;