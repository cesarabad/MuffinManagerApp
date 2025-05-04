import React from 'react';
import { Tag, Typography } from 'antd';
import { IdcardOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { UserInfoContainer, UserAvatar, TagGroup } from './styled-components.component';
import { UserDetailedDto } from '../../../../models/auth/user-detailed-dto.model';

const { Title, Text } = Typography;

interface UserInfoSectionProps {
  detailedUser: UserDetailedDto;
}

const UserInfoSection: React.FC<UserInfoSectionProps> = ({ detailedUser }) => {
  const { t } = useTranslation();

  // Get first initial of user name for avatar
  const getUserInitial = (): string => {
    return detailedUser?.name 
      ? detailedUser.name.charAt(0).toUpperCase() 
      : "N";
  };

  if (!detailedUser) return null;

  return (
    <UserInfoContainer>
      <UserAvatar isDisabled={detailedUser.disabled} icon={<UserOutlined />} size={64}>
        {getUserInitial()}
      </UserAvatar>
      <div>
        <Title level={4} style={{ margin: '0 0 4px 0' }}>
          {detailedUser.name} {detailedUser.secondName}
        </Title>
        <Text type="secondary">
          <IdcardOutlined style={{ marginRight: 8 }} />
          {detailedUser.dni}
        </Text>
        <TagGroup>
          {detailedUser.groups.map(group => (
            <Tag key={group.id} color="blue">
              {group.name}
            </Tag>
          ))}
          {detailedUser.disabled && (
            <Tag color="red">{t("profile.isDisabledLabel")}</Tag>
          )}
        </TagGroup>
      </div>
    </UserInfoContainer>
  );
};

export default UserInfoSection;