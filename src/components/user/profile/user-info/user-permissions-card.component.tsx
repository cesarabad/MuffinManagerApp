import { Card, Row, Col, Tag, Badge, Typography, Button } from "antd";
import { LockOutlined, SafetyOutlined } from "@ant-design/icons";
import { UserDetailedDto } from "../../../../models/auth/user-detailed-dto.model";
import { GroupedPermissions, Permission, User } from "../../../../models/index.model";

const { Text } = Typography;

interface UserPermissionsCardProps {
  profileUser: User;
  detailedUser: UserDetailedDto;
  t: (key: string) => string;
  expandedPermissionGroups: Record<string, boolean>;
  togglePermissionGroup: (groupKey: string) => void;
  getPermissionColor: (groupName: string) => string;
  getUserPermissionMap: () => { [key: string]: boolean };
}

const UserPermissionsCard: React.FC<UserPermissionsCardProps> = ({
  profileUser,
  detailedUser,
  t,
  expandedPermissionGroups,
  togglePermissionGroup,
  getPermissionColor,
  getUserPermissionMap
}) => {
  const renderPermissions = () => {
    if (!profileUser || !detailedUser) return null;

    const permissionMap = getUserPermissionMap();

    return Object.entries(GroupedPermissions).map(([groupKey, groupValue]) => {
      // Check if the group has subgroups
      const hasSubGroups = !Array.isArray(groupValue);
      
      // For groups with subgroups, check if there are permissions in any subgroup
      let hasAnyPermissions = false;
      let permissionCount = 0;
      let groupPermissions: { subgroup?: string; permission: string }[] = [];
      
      const checkPermission = (perm: Permission) => {
        return permissionMap[perm] === true;
      };
      
      if (hasSubGroups) {
        // Check permissions in subgroups
        Object.entries(groupValue).forEach(([subGroupKey, permissions]) => {
          const filteredPermissions = (permissions as Permission[]).filter(checkPermission);
          if (filteredPermissions.length > 0) {
            hasAnyPermissions = true;
            permissionCount += filteredPermissions.length;
            filteredPermissions.forEach(perm => {
              groupPermissions.push({
                subgroup: subGroupKey,
                permission: perm
              });
            });
          }
        });
      } else {
        // Check permissions in simple group
        const filteredPermissions = (groupValue as Permission[]).filter(checkPermission);
        hasAnyPermissions = filteredPermissions.length > 0;
        permissionCount = filteredPermissions.length;
        filteredPermissions.forEach(perm => {
          groupPermissions.push({
            permission: perm
          });
        });
      }
      
      if (!hasAnyPermissions) return null;

      // Determine if this group is expanded
      const isExpanded = expandedPermissionGroups[groupKey] || false;

      // Group permissions by subgroup
      const permissionsBySubgroup: Record<string, string[]> = {};
      groupPermissions.forEach(item => {
        const key = item.subgroup || 'default';
        if (!permissionsBySubgroup[key]) {
          permissionsBySubgroup[key] = [];
        }
        permissionsBySubgroup[key].push(item.permission);
      });
      
      return (
        <Card
          key={groupKey}
          title={
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <SafetyOutlined style={{ marginRight: 12, color: getPermissionColor(groupKey), fontSize: 20 }} />
                <Text strong style={{ fontSize: 16 }}>{t(`permissionGroup.${groupKey}`)}</Text>
              </div>
              <Badge 
                count={permissionCount} 
                style={{ 
                  backgroundColor: getPermissionColor(groupKey),
                  boxShadow: `0 0 0 2px #fff, 0 2px 5px rgba(0,0,0,0.15)`
                }} 
                overflowCount={99}
                title={`${permissionCount} ${t("profile.permissions")}`}
              />
            </div>
          }
          style={{ 
            borderRadius: 10, 
            marginBottom: 16,
            borderLeft: `3px solid ${getPermissionColor(groupKey)}`,
            cursor: permissionCount > 3 ? "pointer" : "default"
          }}
          bodyStyle={{ padding: isExpanded ? "16px" : "12px 16px" }}
          hoverable
          onClick={permissionCount > 3 ? () => togglePermissionGroup(groupKey) : undefined}
          extra={permissionCount > 3 ? (
            <Button 
              type="link" 
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                togglePermissionGroup(groupKey);
              }}
            >
              {isExpanded ? t("button.collapse") : t("button.expand")}
            </Button>
          ) : null}
        >
          {isExpanded ? (
            <div>
              {Object.entries(permissionsBySubgroup).map(([subgroup, permissions]) => (
                <div key={subgroup} style={{ marginBottom: 16 }}>
                  {subgroup !== 'default' && (
                    <div 
                      style={{ 
                        marginBottom: 8, 
                        paddingBottom: 8, 
                        borderBottom: "1px solid #f0f0f0"
                      }}
                    >
                      <Text strong>{t(`permissionGroup.${subgroup}`)}</Text>
                    </div>
                  )}
                  <Row gutter={[8, 8]}>
                    {permissions.map(perm => (
                      <Col key={perm} xs={24} sm={12} md={8} lg={6}>
                        <Tag 
                          color={getPermissionColor(subgroup !== 'default' ? subgroup : groupKey)}
                          style={{ 
                            padding: "4px 8px", 
                            margin: "4px 4px",
                            borderRadius: 4,
                            fontSize: "13px"
                          }}
                        >
                          {t(`permission.${perm}`)}
                        </Tag>
                      </Col>
                    ))}
                  </Row>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: "4px 0" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {groupPermissions.slice(0, 3).map((item, index) => (
                  <Tag 
                    key={index}
                    color={getPermissionColor(item.subgroup || groupKey)}
                  >
                    {t(`permission.${item.permission}`)}
                  </Tag>
                ))}
                {permissionCount > 3 && (
                  <Tag 
                    color="default"
                    style={{ cursor: "pointer" }}
                  >
                    +{permissionCount - 3} más
                  </Tag>
                )}
              </div>
            </div>
          )}
        </Card>
      );
    }).filter(Boolean); // Filter out null elements
  };

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <LockOutlined style={{ marginRight: 12, color: "#1890ff", fontSize: 20 }} />
          <span style={{ fontSize: 18 }}>{t("profile.permissionsLabel")}</span>
        </div>
      }
      style={{ 
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        overflow: "hidden"
      }}
      headStyle={{ padding: "16px 24px" }}
      bodyStyle={{ padding: 24 }}
    >
      <div>
        {renderPermissions()}
      </div>
    </Card>
  );
};

export default UserPermissionsCard;