import React from 'react';
import { Row, Col, Checkbox, Tag, Typography } from 'antd';
import { SafetyOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { PermissionCard } from './styled-components.component';
import { PermissionEntity, Permission, GroupedPermissions } from '../../../../models/index.model';
import { useAuth } from '../../../../contexts/auth/auth.context';

const { Text } = Typography;

interface PermissionsTabProps {
  getPermissionColor: (groupName: string) => string;
  availablePermissions: PermissionEntity[];
  getGroupPermissionIds: () => number[];
  selectedPermissions: number[];
  handlePermissionChange: (permissionId: number, checked: boolean) => void;
}

const PermissionsTab: React.FC<PermissionsTabProps> = ({ 
  getPermissionColor, 
  availablePermissions, 
  getGroupPermissionIds, 
  selectedPermissions, 
  handlePermissionChange
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();

  // Create a map of permission names to IDs
  const getPermissionNameMap = (): Map<string, number> => {
    const permissionNameMap = new Map<string, number>();
    availablePermissions.forEach(p => {
      permissionNameMap.set(p.name, p.id);
    });
    return permissionNameMap;
  };

  const renderPermissionGroups = () => {
    const groupPermissionIds = getGroupPermissionIds();
    const permissionNameMap = getPermissionNameMap();

    // Track rendered permissions to avoid duplicates
    const renderedPermissions = new Set<string>();

    return Object.entries(GroupedPermissions).map(([groupKey, groupValue]) => {
      const hasSubGroups = !Array.isArray(groupValue);

      return (
        <PermissionCard
          key={groupKey}
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <SafetyOutlined style={{ marginRight: 8, color: getPermissionColor(groupKey) }} />
              <Text strong>{t(`permission.category.${groupKey}`)}</Text>
            </div>
          }
          size="small"
        >
          {hasSubGroups ? (
            Object.entries(groupValue as Record<string, Permission[]>).map(([subGroupKey, permissions]) => (
              <div key={subGroupKey} style={{ marginBottom: 16 }}>
                <Text type="secondary" style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                  {t(`permissionGroup.${subGroupKey}`)}
                </Text>
                <Row gutter={[8, 8]}>
                  {(permissions).map((permission) => {
                    // Skip if we've already rendered this permission
                    if (renderedPermissions.has(permission)) return null;
                    renderedPermissions.add(permission);
                    
                    const permId = permissionNameMap.get(permission);
                    if (!permId) return null;
                    const inSelectedGroup = groupPermissionIds.includes(permId);
                    return (
                      <Col key={permission} span={24} sm={12} md={8}>
                        <Checkbox
                          checked={selectedPermissions.includes(permId)}
                          onChange={(e) => handlePermissionChange(permId, e.target.checked)}
                          disabled={!hasPermission(permission) || inSelectedGroup}
                        >
                          <Tag color={getPermissionColor(subGroupKey)}>
                            {t(`permission.${permission}`)}
                          </Tag>
                          {inSelectedGroup && (
                            <>  
                                <br/>
                                <Text type="secondary" style={{ marginLeft: 0, fontSize: '12px' }}>
                                ({t("profile.includedInGroup")})
                                </Text>
                            </>
                            
                          )}
                        </Checkbox>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            ))
          ) : (
            <Row gutter={[8, 8]}>
              {(groupValue as Permission[]).map((permission) => {
                // Skip if we've already rendered this permission
                if (renderedPermissions.has(permission)) return null;
                renderedPermissions.add(permission);
                
                const permId = permissionNameMap.get(permission);
                if (!permId) return null;
                const inSelectedGroup = groupPermissionIds.includes(permId);
                return (
                  <Col key={permission} span={24} sm={12} md={8}>
                    <Checkbox
                      checked={selectedPermissions.includes(permId)}
                      onChange={(e) => handlePermissionChange(permId, e.target.checked)}
                      disabled={!hasPermission(permission) || inSelectedGroup}
                    >
                      <Tag color={getPermissionColor(groupKey)}>
                        {t(`permission.${permission}`)}
                      </Tag>
                      {inSelectedGroup && (
                        <>
                            <br/>
                            <Text type="secondary" style={{ marginLeft: 0, fontSize: '12px' }}>
                            ({t("profile.includedInGroup")})
                            </Text>
                        </>
                        
                      )}
                    </Checkbox>
                  </Col>
                );
              })}
            </Row>
          )}
        </PermissionCard>
      );
    });
  };

  return (
    <div 
      style={{ 
        maxHeight: '500px', 
        overflowY: 'auto', 
        padding: '0 5px',
        scrollbarWidth: 'thin' 
      }}
    >
      {renderPermissionGroups()}
    </div>
  );
};

export default PermissionsTab;