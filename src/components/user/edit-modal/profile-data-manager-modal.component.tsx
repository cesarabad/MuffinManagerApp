import { useEffect, useState } from "react";
import { Modal, Form, Input, Divider, Checkbox, Tabs, Row, Col, Tag, Card, Typography, Select, Button } from "antd";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../contexts/auth/auth.context";
import { GroupedPermissions, GroupEntity, Permission, PermissionEntity } from "../../../models/auth/permisos.model";
import { SafetyOutlined, LockOutlined, UserOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { UserDetailedDto } from "../../../models/auth/user-detailed-dto.model";
import { userService } from "../../../services/user/user.service";
import { UpdateUserDto } from "../../../models/auth/update-user-dto.model";
import { RegisterRequest } from "../../../models/auth/register-request.model";

const { TabPane } = Tabs;
const { Text } = Typography;
const { Option } = Select;

interface ProfileDataManagerModalProps {
  open: boolean;
  onClose: () => void;
  detailedUser?: UserDetailedDto;
}

const ProfileDataManagerModal: React.FC<ProfileDataManagerModalProps> = ({ open, onClose, detailedUser }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { hasPermission, updateUser, createUser } = useAuth();
  const isEdit = !!detailedUser;

  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [manuallySelectedPermissions, setManuallySelectedPermissions] = useState<number[]>([]);

  const [availablePermissions, setAvailablePermissions] = useState<PermissionEntity[]>([]);
  const [availableGroups, setAvailableGroups] = useState<GroupEntity[]>([]);

  useEffect(() => {
    const fetchAvailablePermissions = async () => {
      try {
        const { permissions, groups } = await userService.getAvailableUserPermissions();
        
        // Create a set of all permissions including those from groups
        const allPermissionsSet = new Set<PermissionEntity>();
        
        // Add direct permissions
        permissions.forEach(p => allPermissionsSet.add(p));
        
        // Add permissions from groups
        groups.forEach(group => {
          group.permissions.forEach(p => {
            // Check if we already have this permission by ID
            const existingPerm = Array.from(allPermissionsSet).find(existing => existing.id === p.id);
            if (!existingPerm) {
              allPermissionsSet.add(p);
            }
          });
        });
        
        setAvailablePermissions(Array.from(allPermissionsSet));
        setAvailableGroups(groups);
      } catch (error) {
        console.error("Error fetching available permissions and groups", error);
        setAvailablePermissions([]);
        setAvailableGroups([]);
      }
    };

    if (open) {
      fetchAvailablePermissions();
    }
  }, [open]);

  const getPermissionColor = (groupName: string): string => {
    const colors: Record<string, string> = {
      data: "blue",
      products: "cyan",
      stock: "green",
      users: "orange",
      admin: "red",
      general: "purple",
    };
    return colors[groupName] || "default";
  };

  const handleSubmit = async (values: any) => {
    try {
      if (isEdit) {

        const formData : UpdateUserDto = {
          id: values.id,
          dni: values.dni,
          name: values.name,
          secondName: values.secondName,
          disabled: values.disabled,
          password: values.password,
          newPassword: values.newPassword,
          permissions: availablePermissions.filter(p => manuallySelectedPermissions.includes(p.id)),
          groups: availableGroups.filter(g => selectedGroups.includes(g.id)),
        };
        await updateUser(formData);
      } else {

        const formData : RegisterRequest = {
          dni: values.dni,
          name: values.name,
          secondName: values.secondName,
          password: values.password,
          permissions: availablePermissions.filter(p => manuallySelectedPermissions.includes(p.id)),
          groups: availableGroups.filter(g => selectedGroups.includes(g.id)),
        };
        await createUser(formData);
      }

      onClose();
    } catch (error) {
      console.error("Error submitting user form", error);
    }
  };

  // Function to get all permission IDs from selected groups
  const getGroupPermissionIds = (): number[] => {
    const permissionIds: number[] = [];
    selectedGroups.forEach(groupId => {
      const group = availableGroups.find(g => g.id === groupId);
      if (group) {
        group.permissions.forEach(p => {
          if (!permissionIds.includes(p.id)) {
            permissionIds.push(p.id);
          }
        });
      }
    });
    return permissionIds;
  };

  // Initialize form and permissions when modal opens or user changes
  useEffect(() => {
    if (open) {
      if (isEdit && detailedUser) {
        form.setFieldsValue({
          id: detailedUser.id,
          dni: detailedUser.dni,
          name: detailedUser.name,
          secondName: detailedUser.secondName,
          disabled: detailedUser.disabled,
          password: '',
          newPassword: '',
          confirmPassword: ''
        });

        // Set selected groups
        const groupIds = detailedUser.groups.map(g => g.id);
        setSelectedGroups(groupIds);

        // Get all permissions from groups
        const groupPermissionIds = new Set<number>();
        detailedUser.groups.forEach(group => {
          group.permissions.forEach(permission => groupPermissionIds.add(permission.id));
        });

        // Get permissions directly assigned to the user
        const userPermissionIds = detailedUser.permissions.map(p => p.id);
        
        // Store manually selected permissions (those not from groups)
        const manualPermissions = userPermissionIds.filter(id => !Array.from(groupPermissionIds).includes(id));
        setManuallySelectedPermissions(manualPermissions);
        
        // Set all selected permissions (both from groups and directly assigned)
        const allPermissions = [...new Set([...userPermissionIds, ...Array.from(groupPermissionIds)])];
        setSelectedPermissions(allPermissions);
      } else {
        // Reset form and selections for new user
        form.resetFields();
        setSelectedPermissions([]);
        setSelectedGroups([]);
        setManuallySelectedPermissions([]);
      }
    }
  }, [detailedUser, open, form, availableGroups]);

  // Handle manual permission selection/deselection
  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    const groupPermissionIds = getGroupPermissionIds();
  
    // Don't allow changing permissions that come from groups
    if (groupPermissionIds.includes(permissionId)) {
      return;
    }
  
    // Update manually selected permissions
    const updatedManualPermissions = checked 
      ? [...manuallySelectedPermissions, permissionId] 
      : manuallySelectedPermissions.filter(id => id !== permissionId);
    
    setManuallySelectedPermissions(updatedManualPermissions);
    
    // Combine with group permissions to update all selected permissions
    const allPermissions = [...new Set([...updatedManualPermissions, ...groupPermissionIds])];
    setSelectedPermissions(allPermissions);
  };
  
  // Handle group selection/deselection
  const handleGroupChange = (value: number[]) => {
    setSelectedGroups(value);
  
    // Calculate permissions from selected groups
    const groupPermissionIds = new Set<number>();
    value.forEach(groupId => {
      const group = availableGroups.find(g => g.id === groupId);
      if (group) {
        group.permissions.forEach(p => groupPermissionIds.add(p.id));
      }
    });
  
    // Combine manually selected permissions with group permissions without duplicates
    const allPermissions = [...new Set([...manuallySelectedPermissions, ...Array.from(groupPermissionIds)])];
    setSelectedPermissions(allPermissions);
  };
  
  const renderPermissionGroups = () => {
    const groupPermissionIds = getGroupPermissionIds();
    
    // Create a map of permission names to IDs
    const permissionNameMap = new Map<string, number>();
    availablePermissions.forEach(p => {
      permissionNameMap.set(p.name, p.id);
    });

    // Track rendered permissions to avoid duplicates
    const renderedPermissions = new Set<string>();

    return Object.entries(GroupedPermissions).map(([groupKey, groupValue]) => {
      const hasSubGroups = !Array.isArray(groupValue);

      return (
        <Card
          key={groupKey}
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <SafetyOutlined style={{ marginRight: 8, color: getPermissionColor(groupKey) }} />
              <Text strong>{t(`permissionGroup.${groupKey}`)}</Text>
            </div>
          }
          style={{ marginBottom: 16, borderRadius: 8 }}
          size="small"
        >
          {hasSubGroups ? (
            Object.entries(groupValue).map(([subGroupKey, permissions]) => (
              <div key={subGroupKey} style={{ marginBottom: 16 }}>
                <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
                  {t(`permissionGroup.${subGroupKey}`)}
                </Text>
                <Row gutter={[8, 8]}>
                  {(permissions as Permission[]).map((permission) => {
                    // Skip if we've already rendered this permission
                    if (renderedPermissions.has(permission)) return null;
                    renderedPermissions.add(permission);
                    
                    const permId = permissionNameMap.get(permission);
                    if (!permId) return null;
                    const inSelectedGroup = groupPermissionIds.includes(permId);
                    return (
                      <Col key={permission} span={24}>
                        <Checkbox
                          checked={selectedPermissions.includes(permId)}
                          onChange={(e) => handlePermissionChange(permId, e.target.checked)}
                          disabled={!hasPermission(permission) || inSelectedGroup}
                        >
                          <Tag color={getPermissionColor(subGroupKey)}>
                            {t(`permission.${permission}`)}
                          </Tag>
                          {inSelectedGroup && (
                            <Text type="secondary" style={{ marginLeft: 8, fontSize: '12px' }}>
                              ({t("profile.includedInGroup")})
                            </Text>
                          )}
                        </Checkbox>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            ))
          ) : (
            <Row gutter={[8, 8]}>
              {(groupValue as Permission[]).map((permission) => {
                // Skip if we've already rendered this permission
                if (renderedPermissions.has(permission)) return null;
                renderedPermissions.add(permission);
                
                const permId = permissionNameMap.get(permission);
                if (!permId) return null;
                const inSelectedGroup = groupPermissionIds.includes(permId);
                return (
                  <Col key={permission} span={24}>
                    <Checkbox
                      checked={selectedPermissions.includes(permId)}
                      onChange={(e) => handlePermissionChange(permId, e.target.checked)}
                      disabled={!hasPermission(permission) || inSelectedGroup}
                    >
                      <Tag color={getPermissionColor(groupKey)}>
                        {t(`permission.${permission}`)}
                      </Tag>
                      {inSelectedGroup && (
                        <Text type="secondary" style={{ marginLeft: 8, fontSize: '12px' }}>
                          ({t("profile.includedInGroup")})
                        </Text>
                      )}
                    </Checkbox>
                  </Col>
                );
              })}
            </Row>
          )}
        </Card>
      );
    });
  };

  return (
    <Modal
      title={isEdit ? t("profile.editTitle") : t("profile.createTitle")}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={isEdit ? t("button.update") : t("button.create")}
      cancelText={t("button.cancel")}
      width={800}
      footer={
        <div style={{ textAlign: "left" }}>
          <Divider orientation="left" plain style={{ marginTop: "10px", marginBottom: '10px' }} />
          <strong>{t("profile.verificationSectionTitle")}</strong>
            
          <Form form={form} layout="vertical">
            <Form.Item
              label={t("profile.passwordLabel")}
              name="password"
              style={{ marginTop: '10px' }}
              rules={[
          { required: true, message: t("validation.required") },
          { min: 6, message: t("validation.passwordMinLength", { min: 6 }) },
              ]}
            >
              <Input.Password />
            </Form.Item>
            
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
              <Button onClick={onClose} style={{ marginRight: 8 }}>
          {t("button.cancel")}
              </Button>
              <Button type="primary" onClick={() => form.submit()}>
          {isEdit ? t("button.update") : t("button.create")}
              </Button>
            </div>
          </Form>
        </div>
      }
    >
      <Tabs defaultActiveKey="basicInfo">
        <TabPane
          tab={<><UserOutlined /> {t("profile.basicInfo")}</>}
          key="basicInfo"
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            {isEdit && (
              <>
                <Form.Item name="id" hidden><Input /></Form.Item>
                <Form.Item name="disabled" valuePropName="checked">
                  <Checkbox>{t("profile.isDisabledLabel")}</Checkbox>
                </Form.Item>
              </>
            )}

            <Form.Item
              label={t("profile.dniLabel")}
              name="dni"
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={t("profile.nameLabel")}
              name="name"
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={t("profile.secondNameLabel")}
              name="secondName"
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={isEdit ? t("profile.newPasswordLabel") : t("profile.passwordLabel")}
              name="newPassword"
              rules={[{ min: 6, message: t("validation.passwordMinLength", { min: 6 }) },
                { required: !isEdit, message: t("validation.required") }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label={t("profile.confirmPasswordLabel")}
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t("validation.passwordsMustMatch")));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

          </Form>
        </TabPane>

        <TabPane
          tab={<><UsergroupAddOutlined /> {t("profile.groupsLabel")}</>}
          key="groups"
        >
          <div style={{ padding: '0 5px' }}>
            <Form.Item label={t("profile.selectGroups")}>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder={t("profile.selectGroupsPlaceholder")}
                value={selectedGroups}
                onChange={handleGroupChange}
              >
                {availableGroups.map(group => (
                  <Option key={group.id} value={group.id}>{group.name}</Option>
                ))}
              </Select>
            </Form.Item>

            {selectedGroups.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Text strong>{t("profile.selectedGroups")}</Text>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                  {selectedGroups.map(groupId => {
                    const group = availableGroups.find(g => g.id === groupId);
                    return group ? (
                      <Tag
                        key={group.id}
                        color="blue"
                        closable
                        onClose={() => handleGroupChange(selectedGroups.filter(id => id !== group.id))}
                      >
                        {group.name}
                      </Tag>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        </TabPane>

        <TabPane
          tab={<><LockOutlined /> {t("profile.permissionsLabel")}</>}
          key="permissions"
        >
          <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '0 5px' }}>
            {renderPermissionGroups()}
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default ProfileDataManagerModal;