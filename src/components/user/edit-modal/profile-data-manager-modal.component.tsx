import { useEffect, useState } from "react";
import { Modal, Form, Input, Divider, Checkbox, Tabs, Row, Col, Tag, Card, Typography, Select } from "antd";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../contexts/auth/auth.context";
import { toast } from "react-toastify";
import { GroupedPermissions, GroupEntity, Permission, PermissionEntity } from "../../../models/auth/permisos.model";
import { SafetyOutlined, LockOutlined, UserOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { UserDetailedDto } from "../../../models/auth/user-detailed-dto.model";

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
  const { hasPermission: currentUserHasPermission } = useAuth();
  const isEdit = !!detailedUser;
  
  // Store selected permissions and groups
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  
  // Available permissions and groups (would normally come from an API)
  const [availablePermissions, setAvailablePermissions] = useState<PermissionEntity[]>([]);
  const [availableGroups, setAvailableGroups] = useState<GroupEntity[]>([]);

  useEffect(() => {
    // In a real implementation, you would fetch these from an API
    // For now, we'll extract them from the detailedUser
    if (detailedUser) {
      // Extract unique permissions from the user's permissions and group permissions
      const uniquePermissions = new Map<number, PermissionEntity>();
      
      // Add direct permissions
      detailedUser.permissions.forEach(p => {
        uniquePermissions.set(p.id, p);
      });
      
      // Add permissions from groups
      detailedUser.groups.forEach(group => {
        group.permissions.forEach(p => {
          uniquePermissions.set(p.id, p);
        });
      });
      
      setAvailablePermissions(Array.from(uniquePermissions.values()));
      setAvailableGroups(detailedUser.groups);
    } else {
      // For creating a new user, you would fetch all available permissions and groups
      // For now, we'll use empty arrays
      setAvailablePermissions([]);
      setAvailableGroups([]);
    }
  }, [detailedUser]);

  // Function to get a color based on permission category
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

  // Function to check if current user can grant a permission
  const canGrantPermission = (permission: Permission): boolean => {
    // Developer can grant any permission
    if (currentUserHasPermission(Permission.Dev)) return true;
    
    // SuperAdmin can grant any permission except Dev
    if (currentUserHasPermission(Permission.SuperAdmin)) {
      return permission !== Permission.Dev;
    }
    
    // Regular users can only grant permissions they already have
    return currentUserHasPermission(permission);
  };

  const handleSubmit = async (values: any) => {
    try {
      // Convert selected permissions and groups to the format expected by the API
      const formData = {
        ...values,
        permissions: selectedPermissions.map(id => ({ id })),
        groups: selectedGroups.map(id => ({ id }))
      };
      
      // For demonstration, show not implemented alert
      alert('No implementado');
      
      if (isEdit) {
        // In a real implementation, this would call updateUser with UserDetailedDto
        toast.success(t("profile.updateSuccess"));
      } else {
        // In a real implementation, this would call createUser with UserDetailedDto
        toast.success(t("profile.createSuccess"));
      }
      onClose();
    } catch (error) {
      console.error("Error handling submit:", error);
      toast.error(t("error.password"));
    }
  };

  // Init form values when the modal opens or detailedUser changes
  useEffect(() => {
    if (open) {
      if (isEdit && detailedUser) {
        form.setFieldsValue({
          id: detailedUser.id,
          dni: detailedUser.dni,
          name: detailedUser.name,
          secondName: detailedUser.secondName,
          password: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Set selected permissions and groups
        setSelectedPermissions(detailedUser.permissions.map(p => p.id));
        setSelectedGroups(detailedUser.groups.map(g => g.id));
      } else {
        form.resetFields();
        setSelectedPermissions([]);
        setSelectedGroups([]);
      }
    }
  }, [detailedUser, open, form]);

  // Handle permission selection changes
  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    setSelectedPermissions(prev => {
      if (checked) {
        return [...prev, permissionId];
      } else {
        return prev.filter(id => id !== permissionId);
      }
    });
  };

  // Handle group selection changes
  const handleGroupChange = (value: number[]) => {
    setSelectedGroups(value);
  };

  // Get permissions included in selected groups
  const getGroupPermissionIds = (): number[] => {
    if (!availableGroups || availableGroups.length === 0) return [];
    
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

  // Get permission name from permission id
  const getPermissionName = (permissionId: number): string => {
    const permission = availablePermissions.find(p => p.id === permissionId);
    return permission ? permission.name : '';
  };

  // Render permission checkboxes grouped by category
  const renderPermissionGroups = () => {
    // Get the permissions included in selected groups to avoid duplications
    const groupPermissionIds = getGroupPermissionIds();

    // Map permission entities to Permission enum for GroupedPermissions usage
    const permissionNameMap = new Map<string, number>();
    availablePermissions.forEach(p => {
      permissionNameMap.set(p.name, p.id);
    });

    return Object.entries(GroupedPermissions).map(([groupKey, groupValue]) => {
      // Check if the group has subgroups
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
            // Render subgroups
            Object.entries(groupValue).map(([subGroupKey, permissions]) => (
              <div key={subGroupKey} style={{ marginBottom: 16 }}>
                <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
                  {t(`permissionGroup.${subGroupKey}`)}
                </Text>
                <Row gutter={[8, 8]}>
                  {(permissions as Permission[]).map((permission) => {
                    // Find the permission entity id with this name
                    const permId = permissionNameMap.get(permission);
                    if (!permId) return null;
                    
                    // Check if this permission is included in a selected group
                    const inSelectedGroup = groupPermissionIds.includes(permId);
                    
                    return (
                      <Col key={permission} span={24}>
                        <Checkbox
                          checked={selectedPermissions.includes(permId) || inSelectedGroup}
                          onChange={(e) => handlePermissionChange(permId, e.target.checked)}
                          disabled={!canGrantPermission(permission) || inSelectedGroup}
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
            // Render permissions directly
            <Row gutter={[8, 8]}>
              {(groupValue as Permission[]).map((permission) => {
                // Find the permission entity id with this name
                const permId = permissionNameMap.get(permission);
                if (!permId) return null;
                
                // Check if this permission is included in a selected group
                const inSelectedGroup = groupPermissionIds.includes(permId);
                
                return (
                  <Col key={permission} span={24}>
                    <Checkbox
                      checked={selectedPermissions.includes(permId) || inSelectedGroup}
                      onChange={(e) => handlePermissionChange(permId, e.target.checked)}
                      disabled={!canGrantPermission(permission) || inSelectedGroup}
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
    >
      <Tabs defaultActiveKey="basicInfo">
        <TabPane 
          tab={
            <span>
              <UserOutlined /> {t("profile.basicInfo")}
            </span>
          } 
          key="basicInfo"
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            {isEdit && (
              <Form.Item name="id" hidden>
                <Input />
              </Form.Item>
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
              label={t("profile.newPasswordLabel")}
              name="newPassword"
              rules={[
                { min: 6, message: t("validation.passwordMinLength", { min: 6 }) },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label={t("profile.confirmPasswordLabel")}
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: !isEdit, message: t("validation.required") },
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

            <Divider orientation="left" plain style={{ marginTop: "40px", marginBottom: '10px' }} />
            <strong>{t("profile.verificationSectionTitle")}</strong>

            <Form.Item
              label={t("profile.passwordLabel")}
              name="password"
              style={{ marginTop: '30px' }}
              rules={[
                { required: true, message: t("validation.required") },
                { min: 6, message: t("validation.passwordMinLength", { min: 6 }) },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Form>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <UsergroupAddOutlined /> {t("profile.groupsLabel")}
            </span>
          } 
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
                  <Option key={group.id} value={group.id}>
                    {group.name}
                  </Option>
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
                        onClose={() => setSelectedGroups(prev => prev.filter(id => id !== group.id))}
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
          tab={
            <span>
              <LockOutlined /> {t("profile.permissionsLabel")}
            </span>
          } 
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