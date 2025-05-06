import { useEffect, useState } from "react";
import { 
  Form, 
  Divider, 
  Tabs, 
  Typography, 
  Button,
  message,
  Input
} from "antd";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../contexts/auth/auth.context";
import { 
  GroupEntity, 
  PermissionEntity 
} from "../../../models/auth/permission.model";
import { 
  KeyOutlined,
  CheckCircleOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  LockOutlined
} from "@ant-design/icons";
import { UserDetailedDto } from "../../../models/auth/user-detailed-dto.model";
import { userService } from "../../../services/user/user.service";
import { UpdateUserDto } from "../../../models/auth/update-user-dto.model";
import { RegisterRequest } from "../../../models/auth/register-request.model";

// Import componentes
import UserInfoSection from "./components/user-info-section.component";
import BasicInfoTab from "./components/basic-info-tab.component";
import GroupsTab from "./components/groups-tab.component";
import PermissionsTab from "./components/permissions-tab.component";

// Styled components
import { StyledModal } from "./components/styled-components.component";
import { useWebSocketListener } from "../../../services/web-socket-listenner.service";

const { TabPane } = Tabs;
const { Title } = Typography;

interface ProfileDataManagerModalProps {
  open: boolean;
  onClose: () => void;
  detailedUser?: UserDetailedDto;
}

const ProfileDataManagerModal: React.FC<ProfileDataManagerModalProps> = ({ 
  open, 
  onClose, 
  detailedUser 
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { updateUser, createUser } = useAuth();
  const isEdit = !!detailedUser;

  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [manuallySelectedPermissions, setManuallySelectedPermissions] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [availablePermissions, setAvailablePermissions] = useState<PermissionEntity[]>([]);
  const [availableGroups, setAvailableGroups] = useState<GroupEntity[]>([]);

  const fetchAvailablePermissions = async () => {
    setLoading(true);
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
      message.error(t("errors.fetchPermissionsFailed"));
      setAvailablePermissions([]);
      setAvailableGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    

    if (open) {
      fetchAvailablePermissions();
    }
  }, [open, t]);
  useWebSocketListener("/topic/group", fetchAvailablePermissions);

  const getPermissionColor = (groupName: string): string => {
    const colors: Record<string, string> = {
      data: "blue",
      products: "cyan",
      stock: "green",
      users: "orange",
      role: "red",
      general: "purple",
    };
    return colors[groupName] || "default";
  };

  

  const handleSubmit = async () => {
    try {
      // Validar el formulario antes de enviar
      await form.validateFields();
      
      // Obtener valores actualizados
      const values = form.getFieldsValue();
      
      setLoading(true);
      
      if (isEdit) {
        const formData: UpdateUserDto = {
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
        message.success(t("profile.updateSuccess"));
      } else {
        const formData: RegisterRequest = {
          dni: values.dni,
          name: values.name,
          secondName: values.secondName,
          password: values.password || values.newPassword,
          permissions: availablePermissions.filter(p => manuallySelectedPermissions.includes(p.id)),
          groups: availableGroups.filter(g => selectedGroups.includes(g.id)),
        };
        await createUser(formData);
        message.success(t("profile.createSuccess"));
      }

      onClose();
    } catch (error) {
      console.error("Error submitting user form", error);
      message.error(t("errors.submitFailed"));
    } finally {
      setLoading(false);
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

  return (
    <StyledModal
      title={isEdit ? t("profile.editTitle") : t("profile.createTitle")}
      open={open}
      onCancel={onClose}
      width={800}
      centered
      isDisabled={detailedUser?.disabled}
      maskClosable={false}
      footer={
        <div style={{ textAlign: "left" }}>
          <Divider orientation="left" plain style={{ marginTop: "10px", marginBottom: '10px' }} />
          <Title level={5} style={{ margin: '0 0 16px 0' }}>
            <KeyOutlined style={{ marginRight: 8 }} />
            {t("profile.verificationSectionTitle")}
          </Title>
            
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
              <Button 
                type="primary" 
                onClick={handleSubmit} 
                loading={loading}
                icon={<CheckCircleOutlined />}
              >
                {isEdit ? t("button.update") : t("button.create")}
              </Button>
            </div>
          </Form>
        </div>
      }
    >
      {isEdit && detailedUser && (
        <UserInfoSection detailedUser={detailedUser} />
      )}
      
      <Tabs 
        defaultActiveKey="basicInfo"
        type="card"
        size="large"
        animated={{ inkBar: true, tabPane: true }}
      >
        <TabPane
          tab={
            <span>
              <UserOutlined style={{ marginRight: 8 }} />
              {t("profile.basicInfo")}
            </span>
          }
          key="basicInfo"
        >
          <BasicInfoTab 
            form={form} 
            isEdit={isEdit} 
            onFinish={handleSubmit} 
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <UsergroupAddOutlined style={{ marginRight: 8 }} />
              {t("profile.groupsLabel")}
            </span>
          }
          key="groups"
        >
          <GroupsTab 
            availableGroups={availableGroups}
            selectedGroups={selectedGroups}
            handleGroupChange={handleGroupChange}
            getGroupPermissionIds={getGroupPermissionIds}
            availablePermissions={availablePermissions}
            loading={loading}
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <LockOutlined style={{ marginRight: 8 }} />
              {t("profile.permissionsLabel")}
            </span>
          }
          key="permissions"
        >
          <PermissionsTab 
            getPermissionColor={getPermissionColor}
            availablePermissions={availablePermissions}
            getGroupPermissionIds={getGroupPermissionIds}
            selectedPermissions={selectedPermissions}
            handlePermissionChange={handlePermissionChange}
          />
        </TabPane>
      </Tabs>
    </StyledModal>
  );
};

export default ProfileDataManagerModal;