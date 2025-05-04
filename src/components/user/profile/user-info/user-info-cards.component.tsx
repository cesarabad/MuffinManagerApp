import { Card, Row, Col } from "antd";
import { UserOutlined, IdcardOutlined, CrownOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { UserDetailedDto } from "../../../../models/auth/user-detailed-dto.model";

const InfoCardContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 16px;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
  border-left: 4px solid transparent;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .info-label {
    color: #8c8c8c;
    font-size: 14px;
    margin-bottom: 8px;
  }
  
  .info-value {
    font-size: 16px;
    font-weight: 500;
  }
`;

interface UserInfoCardProps {
  detailedUser: UserDetailedDto;
  t: (key: string) => string;
  userRole: React.ReactNode;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ detailedUser, t, userRole }) => {
  return (
    <Card 
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <UserOutlined style={{ marginRight: 12, color: "#1890ff", fontSize: 20 }} />
          <span style={{ fontSize: 18 }}>{t("profile.personalInfo")}</span>
        </div>
      }
      style={{ 
        borderRadius: 12, 
        marginBottom: 24,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        overflow: "hidden"
      }}
      headStyle={{ padding: "16px 24px" }}
      bodyStyle={{ padding: 24 }}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <InfoCardContainer style={{ borderLeftColor: "#1890ff" }}>
            <div className="info-label">
              <IdcardOutlined style={{ marginRight: 8 }} />
              {t("profile.dniLabel")}
            </div>
            <div className="info-value">{detailedUser.dni}</div>
          </InfoCardContainer>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <InfoCardContainer style={{ borderLeftColor: "#52c41a" }}>
            <div className="info-label">
              <UserOutlined style={{ marginRight: 8 }} />
              {t("profile.nameLabel")}
            </div>
            <div className="info-value">{detailedUser.name}</div>
          </InfoCardContainer>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <InfoCardContainer style={{ borderLeftColor: "#fa8c16" }}>
            <div className="info-label">
              <UserOutlined style={{ marginRight: 8 }} />
              {t("profile.secondNameLabel")}
            </div>
            <div className="info-value">{detailedUser.secondName}</div>
          </InfoCardContainer>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <InfoCardContainer style={{ borderLeftColor: "#722ed1" }}>
            <div className="info-label">
              <CrownOutlined style={{ marginRight: 8 }} />
              {t("profile.roleLabel")}
            </div>
            <div className="info-value">
              {userRole}
            </div>
          </InfoCardContainer>
        </Col>
      </Row>
    </Card>
  );
};

export default UserInfoCard;