import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Checkbox, Button, Row, Col, Spin, Typography, Space, Alert, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { userService } from "../../../../../services/user/user.service";
import { toast } from "react-toastify";
import { GroupedPermissions, GroupEntity, Permission, PermissionEntity } from "../../../../../models/index.model";

// COMPONENTE MODAL
interface CreateGroupEntityModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  groupToEdit?: GroupEntity | null;
  availablePermissions: PermissionEntity[];
  loading: boolean;
}

const { Title, Text } = Typography;

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
  const [permissionsByCategory, setPermissionsByCategory] = useState<Record<string, PermissionEntity[]>>({});
  
  // Determine if we're in edit mode
  const isEditMode = !!groupToEdit;

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
      
      // Organize permissions by category
      organizePermissionsByCategory(availablePermissions);
    }
  }, [open, form, isEditMode, groupToEdit, availablePermissions]);

  // Organize permissions into categories for better UI display
  const organizePermissionsByCategory = (permissions: PermissionEntity[]) => {
    const categories: Record<string, PermissionEntity[]> = {
      "admin": [],
      "users": [],
      "data": [],
      "stock": [],
      "other": []
    };

    permissions.forEach(permission => {
      // Try to match permission name with categories from GroupedPermissions
      let matched = false;
      
      // Check if permission belongs to admin category
      if (Array.isArray(GroupedPermissions.admin) && GroupedPermissions.admin.includes(permission.name as Permission)) {
        categories.admin.push(permission);
        matched = true;
      } 
      // Check if permission belongs to users category
      else if (Array.isArray(GroupedPermissions.users) && GroupedPermissions.users.includes(permission.name as Permission)) {
        categories.users.push(permission);
        matched = true;
      } 
      // Check if permission belongs to stock category
      else if (Array.isArray(GroupedPermissions.stock) && GroupedPermissions.stock.includes(permission.name as Permission)) {
        categories.stock.push(permission);
        matched = true;
      } 
      // Check if permission belongs to data category (more complex as it has subcategories)
      else {
        // Check data.general
        if (typeof GroupedPermissions.data === 'object' &&  
            'general' in GroupedPermissions.data && 
            GroupedPermissions.data.general?.includes(permission.name as Permission)) {
          categories.data.push(permission);
          matched = true;
        } 
        // Check data.products
        else if (typeof GroupedPermissions.data === 'object' && 
                'products' in GroupedPermissions.data && 
                GroupedPermissions.data.products?.includes(permission.name as Permission)) {
          categories.data.push(permission);
          matched = true;
        }
      }
      
      // If no match found, put in "other" category
      if (!matched) {
        categories.other.push(permission);
      }
    });
    
    // Remove empty categories
    Object.keys(categories).forEach(key => {
      if (categories[key].length === 0) {
        delete categories[key];
      }
    });
    
    setPermissionsByCategory(categories);
  };

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
      
      console.log("Group Data:", groupData);
      
      if (isEditMode) {
        // Update existing group logic would go here
        // For now, we'll just use createGroupEntity as the endpoint
        await userService.saveGroupEntity(groupData);
        toast.success(t("success.groupUpdated"));
      } else {
        // Create new group
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

  const handleSelectAllInCategory = (categoryPermissions: PermissionEntity[], checked: boolean) => {
    const currentPermissionIds = form.getFieldValue('permissionIds') || [];
    
    if (checked) {
      // Add all permissions from this category that aren't already selected
      const newPermissionIds = [
        ...currentPermissionIds,
        ...categoryPermissions
          .filter(p => !currentPermissionIds.includes(p.id))
          .map(p => p.id)
      ];
      form.setFieldsValue({ permissionIds: newPermissionIds });
    } else {
      // Remove all permissions from this category
      const categoryPermissionIds = categoryPermissions.map(p => p.id);
      const newPermissionIds = currentPermissionIds.filter((id: number) => !categoryPermissionIds.includes(id));
      form.setFieldsValue({ permissionIds: newPermissionIds });
    }
  };


  return (
    <Modal
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            {isEditMode ? t("profile.editGroup") : t("profile.createGroup")}
          </Title>
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ permissionIds: [] }}
        >
          <Form.Item
            name="name"
            label={t("profile.groupName")}
            rules={[{ required: true, message: t("validation.required") }]}
          >
            <Input 
              placeholder={t("profile.groupNamePlaceholder")} 
              maxLength={50}
              showCount
            />
          </Form.Item>

          {availablePermissions.length > 0 ? (
            <Form.Item
                name="permissionIds"
                label={t("profile.selectPermissions")}
                rules={[{ 
                required: true, 
                message: t("validation.selectAtLeastOne"),
                type: 'array',
                min: 1
                }]}
            >
                <Checkbox.Group 
                    style={{ width: '100%' }}
                    value={form.getFieldValue('permissionIds')}
                    onChange={(checkedValues) => form.setFieldsValue({ permissionIds: checkedValues })}
                    >
                    {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                        <div key={category} style={{ marginBottom: 24 }}>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: 8 
                        }}>
                            <Space>
                            <Text strong>{t(`permission.category.${category}`)}</Text>
                            <Text type="secondary">({permissions.length})</Text>
                            </Space>
                            <Checkbox
                            checked={permissions.every(p => (form.getFieldValue('permissionIds') || []).includes(p.id))}
                            indeterminate={
                                permissions.some(p => (form.getFieldValue('permissionIds') || []).includes(p.id)) &&
                                !permissions.every(p => (form.getFieldValue('permissionIds') || []).includes(p.id))
                            }
                            onChange={(e) => handleSelectAllInCategory(permissions, e.target.checked)}
                            >
                            {t("button.selectAll")}
                            </Checkbox>
                        </div>

                        <Row gutter={[16, 8]}>
                            {permissions.map(permission => (
                            <Col xs={24} sm={12} md={8} key={permission.id}>
                                <div style={{ 
                                border: '1px solid #f0f0f0',
                                borderRadius: 6,
                                padding: 8,
                                display: 'flex',
                                alignItems: 'center'
                                }}>
                                <Checkbox value={permission.id}>
                                    <Tooltip title={t(`permission.${permission.name}`)}>
                                    <div style={{ 
                                        maxWidth: '100%', 
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {t(`permission.${permission.name}`)}
                                    </div>
                                    </Tooltip>
                                </Checkbox>
                                </div>
                            </Col>
                            ))}
                        </Row>
                        </div>
                    ))}
                    </Checkbox.Group>

            </Form.Item>
          
          ) : (
            <Alert
              message={t("permission.noPermissionsAvailable")}
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Row justify="end" gutter={[8, 0]} style={{ marginTop: 24 }}>
            <Col>
              <Button onClick={onClose}>
                {t("button.cancel")}
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
              >
                {isEditMode ? t("button.update") : t("button.create")}
              </Button>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};

export default CreateGroupEntityModal;