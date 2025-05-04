import { Card, Row, Col, Tag, Empty, Typography, Button, Badge } from "antd";
import { TeamOutlined } from "@ant-design/icons";
import { UserDetailedDto } from "../../../../models/auth/user-detailed-dto.model";

const { Text } = Typography;

interface UserGroupsCardProps {
  detailedUser: UserDetailedDto;
  t: (key: string) => string;
  expandedGroups: Record<number, boolean>;
  toggleGroup: (groupId: number) => void;
}

const UserGroupsCard: React.FC<UserGroupsCardProps> = ({ 
  detailedUser, 
  t, 
  expandedGroups, 
  toggleGroup 
}) => {
  const renderGroups = () => {
    if (!detailedUser || !detailedUser.groups || detailedUser.groups.length === 0) {
      return (
        <Empty 
          description={
            <Text style={{ fontSize: 16 }}>{t("profile.noGroups")}</Text>
          } 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
        />
      );
    }

    return (
      <Row gutter={[16, 16]}>
        {detailedUser.groups.map(group => {
          const isExpanded = expandedGroups[group.id] || false;
          
          return (
            <Col xs={24} sm={12} lg={8} key={group.id}>
              <Card
                title={
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <TeamOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                      <span>{group.name}</span>
                    </div>
                    <Badge 
                      count={group.permissions.length} 
                      style={{ backgroundColor: "#1890ff" }}
                      title={`${group.permissions.length} ${t("profile.permissions")}`}
                    />
                  </div>
                }
                style={{ 
                  borderRadius: 10, 
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                  borderLeft: "3px solid #1890ff",
                  height: "100%"
                }}
                onClick={() => toggleGroup(group.id)}
                hoverable
                bodyStyle={{ padding: isExpanded ? "16px" : "12px 16px" }}
                extra={
                  <Button 
                    type="link" 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleGroup(group.id);
                    }}
                  >
                    {isExpanded ? t("button.collapse") : t("button.expand")}
                  </Button>
                }
              >
                {isExpanded ? (
                  <div>
                    <div style={{ 
                      marginBottom: 12, 
                      paddingBottom: 8, 
                      borderBottom: "1px solid #f0f0f0" 
                    }}>
                      <Text strong>{t("profile.permissionsInGroup")}:</Text>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {group.permissions.map(permission => (
                        <Tag 
                          color="blue" 
                          key={permission.id}
                          style={{ 
                            margin: "4px 0", 
                            borderRadius: 4,
                            padding: "2px 8px"
                          }}
                        >
                          {t(`permission.${permission.name}`)}
                        </Tag>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: "4px 0" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {group.permissions.slice(0, 3).map(permission => (
                        <Tag 
                          color="blue" 
                          key={permission.id}
                        >
                          {t(`permission.${permission.name}`)}
                        </Tag>
                      ))}
                      {group.permissions.length > 3 && (
                        <Tag color="default">+{group.permissions.length - 3} más</Tag>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  };

  return (
    <Card 
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <TeamOutlined style={{ marginRight: 12, color: "#1890ff", fontSize: 20 }} />
          <span style={{ fontSize: 18 }}>{t("profile.groupsLabel")}</span>
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
      {renderGroups()}
    </Card>
  );
};

export default UserGroupsCard;