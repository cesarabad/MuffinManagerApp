import { SettingOutlined, CrownOutlined, UserOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { UserDetailedDto } from "../../../../models/auth/user-detailed-dto.model";

const RoleTag = styled.span`
  display: inline-block;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  margin: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: ${props => props.color || "#1890ff"};
  color: white;
`;

interface UserRoleHelperProps {
  detailedUser: UserDetailedDto;
  t: (key: string) => string;
}

const UserRoleHelper: React.FC<UserRoleHelperProps> = ({ detailedUser, t }) => {
  // Helper function to check if a permission is included
  const permissionIncluded = (user: UserDetailedDto, permName: string): boolean => {
    return !!user.permissions.find(p => p.name === permName) ||
           !!user.groups.find(g => g.permissions.find(p => p.name === permName));
  };

  const isDev = permissionIncluded(detailedUser, "dev");
  const isSuperAdmin = permissionIncluded(detailedUser, "super_admin");
  
  if (isDev) {
    return (
      <RoleTag color="#1890ff">
        <SettingOutlined style={{ marginRight: 5 }} /> {t('permission.dev')}
      </RoleTag>
    );
  } else if (isSuperAdmin) {
    return (
      <RoleTag color="#f5222d">
        <CrownOutlined style={{ marginRight: 5 }} /> {t('permission.super_admin')}
      </RoleTag>
    );
  } else {
    return (
      <RoleTag color="#52c41a">
        <UserOutlined style={{ marginRight: 5 }} /> {t('permission.employee')}
      </RoleTag>
    );
  }
};

export default UserRoleHelper;