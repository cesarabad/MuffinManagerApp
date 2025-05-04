import { Row, Col, Typography, Space, Popconfirm, Badge, Avatar, Tooltip } from "antd";
import { IdcardOutlined, FormOutlined, StopOutlined, CheckOutlined } from "@ant-design/icons";
import { UserDetailedDto } from "../../../../models/auth/user-detailed-dto.model";
import styled from "styled-components";

const { Title, Text } = Typography;

// Contenedor principal con un diseño más moderno y sutil
const HeaderContainer = styled.div`
  background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
  
  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

// Barra superior de acento de color
const AccentBar = styled.div<{ $isDisabled?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: ${props => props.$isDisabled 
    ? 'linear-gradient(90deg, #ff4d4f 0%, #ff7875 100%)' 
    : 'linear-gradient(90deg, #1890ff 0%, #36cfc9 100%)'};
`;

// Botones con diseño más moderno
const ActionButton = styled.button<{ variant?: 'primary' | 'danger' | 'success' }>`
  background-color: white;
  color: ${props => {
    if (props.variant === 'danger') return '#ff4d4f';
    if (props.variant === 'success') return '#52c41a';
    return '#1890ff';
  }};
  border: 1px solid ${props => {
    if (props.variant === 'danger') return '#ff4d4f';
    if (props.variant === 'success') return '#52c41a';
    return '#1890ff';
  }};
  border-radius: 6px;
  padding: 0 16px;
  height: 40px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => {
      if (props.variant === 'danger') return '#ff4d4f';
      if (props.variant === 'success') return '#52c41a';
      return '#1890ff';
    }};
    color: white;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    color: #d9d9d9;
    border-color: #d9d9d9;
    cursor: not-allowed;
  }
`;

// Avatar circular mejorado
const UserAvatar = styled(Avatar)<{ $isDisabled?: boolean }>`
  width: 110px;
  height: 110px;
  font-size: 42px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$isDisabled ? '#f5f5f5' : 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)'};
  color: ${props => props.$isDisabled ? 'red' : 'white'};
  border: 4px solid ${props => props.$isDisabled ? '#ff4d4f' : 'white'};
  box-shadow: ${props => props.$isDisabled ? '0 2px 8px rgba(0, 0, 0, 0.06)' : '0 8px 24px rgba(24, 144, 255, 0.25)'};
`;

// Contenedor para el avatar y detalles relacionados
const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

// Badge de estado con mejor diseño
const StatusBadge = styled(Badge)`
  .ant-badge-count {
    box-shadow: 0 0 0 2px white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }
`;

// Etiqueta de rol con diseño original
const RoleTag = styled.div`
  margin-top: 16px;
  color: #1890ff;
  font-size: 14px;
  font-weight: 500;
`;

// Contenedor de información del usuario
const UserInfoContainer = styled.div`
  padding-left: 16px;
  
  @media (max-width: 768px) {
    padding-left: 0;
    margin-top: 16px;
  }
`;

// Línea divisoria para la información
const InfoDivider = styled.div`
  height: 1px;
  background: #f0f0f0;
  margin: 16px 0;
`;

// Contenedor de información
const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin: 12px 0;
  
  .info-icon {
    color: #8c8c8c;
    margin-right: 10px;
    font-size: 16px;
  }
  
  .info-text {
    color: #262626;
    font-size: 15px;
  }
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
      <AccentBar $isDisabled={detailedUser.disabled}/>
      <Row gutter={[24, 24]} align="middle">
        <Col xs={24} sm={8} md={6} style={{ textAlign: "center" }}>
          <AvatarSection>
            <UserAvatar 
              $isDisabled={detailedUser.disabled}
              size={110}
              style={{ marginBottom: 5 }}
            >
              {getUserInitial()}
            </UserAvatar>
            
            {detailedUser.disabled && (
              <StatusBadge 
                count={
                  <Tooltip title={t("profile.inactiveLabel")}>
                    <StopOutlined style={{ color: "red" }} />
                  </Tooltip>
                } 
              style={{ backgroundColor: "#ff4d4f"}}
              />
            )}
            
            <RoleTag>
              {userRole}
            </RoleTag>
          </AvatarSection>
        </Col>
        
        <Col xs={24} sm={16} md={18}>
          <UserInfoContainer>
            <Title level={3} style={{ margin: 0, fontWeight: 600, color: "#262626" }}>
              {detailedUser.name} {detailedUser.secondName}
              {detailedUser.disabled && (
                <Text type="secondary" style={{ fontSize: 14, fontWeight: 'normal', marginLeft: 12 }}>
                  ({t("profile.inactiveLabel")})
                </Text>
              )}
            </Title>
            
            <InfoItem>
              <IdcardOutlined className="info-icon" />
              <Text className="info-text">{detailedUser.dni}</Text>
            </InfoItem>
            
            <InfoDivider />
            
            <div style={{ margin: "16px 0 8px" }}>
              <Space size="middle">
                {canEdit && (
                    <ActionButton
                    onClick={onEdit}
                    disabled={detailedUser.disabled && !isOwnProfile}
                    variant={detailedUser.disabled ? "danger" : "primary"}
                    >
                    <FormOutlined /> {t("button.edit")}
                    </ActionButton>
                )}
                
                {canDisable && (
                  <Popconfirm
                    title={t(!detailedUser.disabled ? "profile.confirmDisable" : "profile.confirmEnable")}
                    onConfirm={onToggleStatus}
                    okText={t("button.yes")}
                    cancelText={t("button.no")}
                    placement="top"
                  >
                    <ActionButton 
                      variant={!detailedUser.disabled ? "danger" : "success"}
                    >
                      {!detailedUser.disabled ? <StopOutlined /> : <CheckOutlined />}
                      {!detailedUser.disabled ? t("button.disable") : t("button.enable")}
                    </ActionButton>
                  </Popconfirm>
                )}
              </Space>
            </div>
          </UserInfoContainer>
        </Col>
      </Row>
    </HeaderContainer>
  );
};

export default ProfileHeader;