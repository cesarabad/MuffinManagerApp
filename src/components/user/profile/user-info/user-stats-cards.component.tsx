import { Card, Row, Col, Spin, Empty, Statistic, Typography } from "antd";
import { 
  InboxOutlined, 
  FormOutlined, 
  UserSwitchOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  RiseOutlined
} from "@ant-design/icons";
import styled from "styled-components";
import { UserStats } from "../../../../models/index.model";

const { Text } = Typography;

const StatsContainer = styled.div`
  border-radius: 12px;
  padding: 24px;
  background-color: #f5f5f5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  height: 100%;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(45deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%);
    pointer-events: none;
  }
`;

interface UserStatsCardProps {
  stats: UserStats | null;
  loading: boolean;
  t: (key: string) => string;
}

const UserStatsCard: React.FC<UserStatsCardProps> = ({ stats, loading, t }) => {
  return (
    <Card 
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <RiseOutlined style={{ marginRight: 12, color: "#1890ff", fontSize: 20 }} />
          <span style={{ fontSize: 18 }}>{t("profile.stats.title")}</span>
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
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text>{t("loading.statistics")}</Text>
          </div>
        </div>
      ) : stats ? (
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={8}>
            <StatsContainer style={{ backgroundColor: "#e6f7ff" }}>
              <Statistic
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <InboxOutlined style={{ marginRight: 8, color: "#1890ff", fontSize: 20 }} />
                    <span style={{ color: "#1890ff", fontWeight: 500 }}>{t("profile.stats.totalEntries")}</span>
                  </div>
                }
                value={stats.totalEntries}
                valueStyle={{ color: "#1890ff", fontWeight: 600 }}
              />
            </StatsContainer>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <StatsContainer style={{ backgroundColor: "#f6ffed" }}>
              <Statistic
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FormOutlined style={{ marginRight: 8, color: "#52c41a", fontSize: 20 }} />
                    <span style={{ color: "#52c41a", fontWeight: 500 }}>{t("profile.stats.totalAdjustments")}</span>
                  </div>
                }
                value={stats.totalAdjustments}
                valueStyle={{ color: "#52c41a", fontWeight: 600 }}
              />
            </StatsContainer>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <StatsContainer style={{ backgroundColor: "#fff7e6" }}>
              <Statistic
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <UserSwitchOutlined style={{ marginRight: 8, color: "#fa8c16", fontSize: 20 }} />
                    <span style={{ color: "#fa8c16", fontWeight: 500 }}>{t("profile.stats.totalAssigneds")}</span>
                  </div>
                }
                value={stats.totalAssigneds}
                valueStyle={{ color: "#fa8c16", fontWeight: 600 }}
              />
            </StatsContainer>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <StatsContainer style={{ backgroundColor: "#fff1f0" }}>
              <Statistic
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <ClockCircleOutlined style={{ marginRight: 8, color: "#f5222d", fontSize: 20 }} />
                    <span style={{ color: "#f5222d", fontWeight: 500 }}>{t("profile.stats.totalReserveds")}</span>
                  </div>
                }
                value={stats.totalReserveds}
                valueStyle={{ color: "#f5222d", fontWeight: 600 }}
              />
            </StatsContainer>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <StatsContainer style={{ backgroundColor: "#f9f0ff" }}>
              <Statistic
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CheckCircleOutlined style={{ marginRight: 8, color: "#722ed1", fontSize: 20 }} />
                    <span style={{ color: "#722ed1", fontWeight: 500 }}>{t("profile.stats.totalChecked")}</span>
                  </div>
                }
                value={stats.totalChecked}
                valueStyle={{ color: "#722ed1", fontWeight: 600 }}
              />
            </StatsContainer>
          </Col>
        </Row>
      ) : (
        <Empty description={<Text style={{ fontSize: 16 }}>{t("profile.noStats")}</Text>} />
      )}
    </Card>
  );
};

export default UserStatsCard;