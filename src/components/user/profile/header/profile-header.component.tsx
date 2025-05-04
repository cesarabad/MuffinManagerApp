import { Row, Col, Typography, Space, Popconfirm, Badge, Avatar } from "antd";
import { UserOutlined, IdcardOutlined, FormOutlined, StopOutlined, CheckOutlined } from "@ant-design/icons";
import { UserDetailedDto } from "../../../../models/auth/user-detailed-dto.model";
import styled from "styled-components";

const { Title, Text } = Typography;

const HeaderContainer = styled.div`
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 24px;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const HeaderButton = styled.button`
  background-color: white;
  color: #1890ff;
  border: none;
  border-radius: 2px;
  padding: 0 15px;
  height: 40px;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  
  &:hover {
    background-color: #f0f0f0;
    color: #096dd9;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    color: #d9d9d9;
    cursor: not-allowed;
  }
`;

const UserAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  font-size: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  color: #1890ff;
  border: 4px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 16px rgba(24, 144, 255, 0.25);
`;

interface ProfileHeaderProps {
  detailedUser: UserDetailedDto;
  canEdit: boolean;
  canDisable: boolean;
  isOwnProfile: boolean;
  t: (key: string) => string;
  onEdit: () => void;
  onToggleStatus: () => void;
  userRole: React.ReactNode;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  detailedUser,
  canEdit,
  canDisable,
  isOwnProfile,
  t,
  onEdit,
  onToggleStatus,
  userRole
}) => {
  const getUserInitial = () => {
    return detailedUser.name.charAt(0).toUpperCase();
  };

  return (
    <HeaderContainer>
      <Row gutter={[24, 24]} align="middle">
        <Col xs={24} md={6} style={{ textAlign: "center" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <UserAvatar size={120} icon={<UserOutlined />}>
              {getUserInitial()}
            </UserAvatar>
            {detailedUser.disabled && (
              <Badge 
                count={<StopOutlined style={{ color: "white" }} />} 
                style={{ 
                  backgroundColor: "#ff4d4f",
                  boxShadow: "0 0 0 2px white",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              />
            )}
          </div>
          <div style={{ marginTop: 16 }}>
            {userRole}
          </div>
        </Col>
        
        <Col xs={24} md={18}>
          <div>
            <Title level={2} style={{ margin: 0, color: "white" }}>
              {detailedUser.name} {detailedUser.secondName}
            </Title>
            
            <div style={{ margin: "16px 0", display: "flex", alignItems: "center" }}>
              <IdcardOutlined style={{ marginRight: 8 }} />
              <Text style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: 16 }}>
                {detailedUser.dni}
              </Text>
            </div>
            
            <div style={{ margin: "24px 0 8px" }}>
              <Space size="large">
                {canEdit && (
                  <HeaderButton
                    onClick={onEdit}
                    disabled={detailedUser.disabled && !isOwnProfile}
                  >
                    <FormOutlined /> {t("button.edit")}
                  </HeaderButton>
                )}
                
                {canDisable && (
                  <Popconfirm
                    title={t(!detailedUser.disabled ? "user.confirmDisable" : "user.confirmEnable")}
                    onConfirm={onToggleStatus}
                    okText={t("button.yes")}
                    cancelText={t("button.no")}
                    placement="topRight"
                  >
                    <HeaderButton 
                      style={{
                        backgroundColor: !detailedUser.disabled ? "#fff1f0" : "white",
                        color: !detailedUser.disabled ? "#ff4d4f" : "#52c41a"
                      }}
                    >
                      {!detailedUser.disabled ? <StopOutlined /> : <CheckOutlined />}
                      {!detailedUser.disabled ? t("button.disable") : t("button.enable")}
                    </HeaderButton>
                  </Popconfirm>
                )}
              </Space>
            </div>
          </div>
        </Col>
      </Row>
    </HeaderContainer>
  );
};

export default ProfileHeader;