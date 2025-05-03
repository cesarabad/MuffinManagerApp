import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/auth/auth.context";
import { GroupedPermissions, Permission, UserStats } from "../../../models/index.model";
import { useTranslation } from "react-i18next";
import {
  Card,
  Empty,
  Button,
  Tag,
  Row,
  Col,
  Spin,
  Statistic,
  Typography,
  Avatar,
} from "antd";
import {
  InboxOutlined,
  FormOutlined,
  UserSwitchOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  UserOutlined,
  LockOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import PageContainer from "../../../components/app/generic-page-container/PageContainer.component";
import EditProfileModal from "../../../components/user/edit-modal/edit-user-modal.component";
import { userService } from "../../../services/user/user.service";

const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, hasPermission } = useAuth();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (user) {
      userService
        .getStats(user.id)
        .then((response) => {
          setStats(response);
        })
        .catch((err) => {
          console.error("Error loading user stats:", err);
        })
        .finally(() => setLoadingStats(false));
    }
  }, [user]);

  // Función para obtener un color según la categoría de permiso
  const getPermissionColor = (groupName: string): string => {
    const colors: Record<string, string> = {
      data: "blue",
      products: "cyan",
      stock: "green",
      users: "orange",
      admin: "red",
      general: "purple",
    };
    return colors[groupName] || "default";
  };

  // Renderiza los permisos agrupados siguiendo la estructura de GroupedPermissions
  const renderPermissions = () => {
    if (!user) return null;

    return Object.entries(GroupedPermissions).map(([groupKey, groupValue]) => {
      // Verificar si el grupo tiene subgrupos
      const hasSubGroups = !Array.isArray(groupValue);
      
      // Para grupos con subgrupos, verificar si hay permisos en algún subgrupo
      let hasAnyPermissions = false;
      
      if (hasSubGroups) {
        // Verificar permisos en subgrupos
        Object.entries(groupValue).forEach(([_, permissions]) => {
          const filteredPermissions = (permissions as Permission[]).filter(
            (perm) => hasPermission(perm)
          );
          if (filteredPermissions.length > 0) {
            hasAnyPermissions = true;
          }
        });
      } else {
        // Verificar permisos en grupo simple
        hasAnyPermissions = (groupValue as Permission[]).some((perm) => hasPermission(perm));
      }
      
      return (
        <Card 
          key={groupKey}
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <SafetyOutlined style={{ marginRight: 8, color: getPermissionColor(groupKey) }} />
              <Text strong>{t(`permissionGroup.${groupKey}`)}</Text>
            </div>
          }
          style={{ marginBottom: 16, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.09)" }}
          bodyStyle={{ padding: hasSubGroups ? "12px 24px" : "16px 24px" }}
        >
          {!hasAnyPermissions ? (
            // Mostrar mensaje cuando no hay permisos en este grupo
            <div style={{ 
              padding: "16px", 
              textAlign: "center", 
              backgroundColor: "#f5f5f5",
              borderRadius: 8,
              color: "#999"
            }}>
              <Text type="secondary">
                {t("profile.noPermissionsInGroup")}
              </Text>
            </div>
          ) : hasSubGroups ? (
            // Renderizar subgrupos
            Object.entries(groupValue).map(([subGroupKey, permissions]) => {
              const filteredPermissions = (permissions as Permission[]).filter(
                (perm) => hasPermission(perm)
              );
              
              if (filteredPermissions.length === 0) return null;
              
              return (
                <div key={subGroupKey} style={{ marginBottom: 16 }}>
                  <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
                    {t(`permissionGroup.${subGroupKey}`)}
                  </Text>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {filteredPermissions.map((perm) => (
                      <Tag 
                        key={perm}
                        color={getPermissionColor(subGroupKey)}
                        style={{ padding: "4px 8px", margin: 0, borderRadius: 4 }}
                      >
                        {t(`permission.${perm}`)}
                      </Tag>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            // Renderizar permisos directos
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(groupValue as Permission[])
                .filter((perm) => hasPermission(perm))
                .map((perm) => (
                  <Tag 
                    key={perm}
                    color={getPermissionColor(groupKey)}
                    style={{ padding: "4px 8px", margin: 0, borderRadius: 4 }}
                  >
                    {t(`permission.${perm}`)}
                  </Tag>
                ))}
            </div>
          )}
        </Card>
      );
    });
  };

  if (!user) {
    if (isAuthenticated()) {
      location.reload();
    }
    return (
      <PageContainer>
        <Empty 
          description={t("profile.notAuthenticated")} 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Sección de información de perfil */}
      <Card
        style={{ 
          borderRadius: 8, 
          marginBottom: 24, 
          boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
          overflow: "hidden"
        }}
      >
        <Row gutter={24}>
          {/* Perfil y Botón de Edición */}
          <Col xs={24} md={6} style={{ textAlign: "center" }}>
            <Avatar 
              size={120} 
              icon={<UserOutlined />} 
              style={{ 
                backgroundColor: "#1890ff",
                marginBottom: 16,
                boxShadow: "0 4px 12px rgba(24,144,255,0.3)"
              }} 
            />
            <Title level={3} style={{ margin: 0 }}>
              {user.name} {user.secondName}
            </Title>
            <div style={{ marginTop: 16 }}>
              <Button type="primary" onClick={() => setIsModalOpen(true)}>
                {t("button.edit")}
              </Button>
            </div>
          </Col>
          
          {/* Información Personal */}
          <Col xs={24} md={18}>
            <div style={{ padding: "0 16px" }}>
              <Title level={4} style={{ marginBottom: 16 }}>
                <UserOutlined style={{ marginRight: 8 }} />
                {t("profile.personalInfo")}
              </Title>
              
              <Row gutter={[16, 16]}>
                {/* Primera columna */}
                <Col xs={24} md={12}>
                  <Card 
                    size="small" 
                    bordered={false}
                    style={{ backgroundColor: "#f5f5f5", height: "100%" }}
                  >
                    <div style={{ marginBottom: 8 }}>
                      <Text type="secondary">{t("profile.dniLabel")}</Text>
                    </div>
                    <div style={{ 
                      backgroundColor: "#fff", 
                      padding: "8px 12px", 
                      borderRadius: 4,
                      border: "1px solid #e8e8e8"
                    }}>
                      <Text strong>{user.dni}</Text>
                    </div>
                  </Card>
                </Col>
                
                {/* Segunda columna */}
                <Col xs={24} md={12}>
                  <Card 
                    size="small" 
                    bordered={false}
                    style={{ backgroundColor: "#f5f5f5", height: "100%" }}
                  >
                    <div style={{ marginBottom: 8 }}>
                      <Text type="secondary">{t("profile.nameLabel")}</Text>
                    </div>
                    <div style={{ 
                      backgroundColor: "#fff", 
                      padding: "8px 12px", 
                      borderRadius: 4,
                      border: "1px solid #e8e8e8"
                    }}>
                      <Text strong>{user.name}</Text>
                    </div>
                  </Card>
                </Col>
                
                {/* Tercera columna */}
                <Col xs={24} md={12}>
                  <Card 
                    size="small" 
                    bordered={false}
                    style={{ backgroundColor: "#f5f5f5", height: "100%" }}
                  >
                    <div style={{ marginBottom: 8 }}>
                      <Text type="secondary">{t("profile.secondNameLabel")}</Text>
                    </div>
                    <div style={{ 
                      backgroundColor: "#fff", 
                      padding: "8px 12px", 
                      borderRadius: 4,
                      border: "1px solid #e8e8e8"
                    }}>
                      <Text strong>{user.secondName}</Text>
                    </div>
                  </Card>
                </Col>
                
                {/* Cuarta columna */}
                <Col xs={24} md={12}>
                  <Card 
                    size="small" 
                    bordered={false}
                    style={{ backgroundColor: "#f5f5f5", height: "100%" }}
                  >
                    <div style={{ marginBottom: 8 }}>
                      <Text type="secondary">{t("profile.roleLabel")}</Text>
                    </div>
                    <div style={{ 
                      backgroundColor: "#fff", 
                      padding: "8px 12px", 
                      borderRadius: 4,
                      border: "1px solid #e8e8e8",
                      color: hasPermission(Permission.SuperAdmin) ? "#f5222d" : 
                            hasPermission(Permission.Dev) ? "#1890ff" : "#52c41a"
                    }}>
                      <Text strong>
                        {hasPermission(Permission.Dev) 
                          ? t('permission.super_admin') 
                          : hasPermission(Permission.SuperAdmin) 
                            ? t('permission.super_admin')
                            : "User"
                        }
                      </Text>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Sección de estadísticas */}
      <Card 
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <ClockCircleOutlined style={{ marginRight: 8, color: "#1890ff" }} />
            <span>{t("profile.stats.title")}</span>
          </div>
        }
        style={{ 
          borderRadius: 8, 
          marginBottom: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,0.09)"
        }}
      >
        {loadingStats ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Spin size="large" />
          </div>
        ) : stats ? (
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={8}>
              <div style={{ 
                backgroundColor: "#e6f7ff", 
                padding: 16, 
                borderRadius: 8,
                height: "100%"
              }}>
                <Statistic
                  title={t("profile.stats.totalEntries")}
                  value={stats.totalEntries}
                  prefix={<InboxOutlined style={{ color: "#1890ff" }} />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <div style={{ 
                backgroundColor: "#f6ffed", 
                padding: 16, 
                borderRadius: 8,
                height: "100%"
              }}>
                <Statistic
                  title={t("profile.stats.totalAdjustments")}
                  value={stats.totalAdjustments}
                  prefix={<FormOutlined style={{ color: "#52c41a" }} />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <div style={{ 
                backgroundColor: "#fff7e6", 
                padding: 16, 
                borderRadius: 8,
                height: "100%"
              }}>
                <Statistic
                  title={t("profile.stats.totalAssigneds")}
                  value={stats.totalAssigneds}
                  prefix={<UserSwitchOutlined style={{ color: "#fa8c16" }} />}
                  valueStyle={{ color: "#fa8c16" }}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <div style={{ 
                backgroundColor: "#fff1f0", 
                padding: 16, 
                borderRadius: 8,
                height: "100%"
              }}>
                <Statistic
                  title={t("profile.stats.totalReserveds")}
                  value={stats.totalReserveds}
                  prefix={<ClockCircleOutlined style={{ color: "#f5222d" }} />}
                  valueStyle={{ color: "#f5222d" }}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <div style={{ 
                backgroundColor: "#f9f0ff", 
                padding: 16, 
                borderRadius: 8,
                height: "100%"
              }}>
                <Statistic
                  title={t("profile.stats.totalChecked")}
                  value={stats.totalChecked}
                  prefix={<CheckCircleOutlined style={{ color: "#722ed1" }} />}
                  valueStyle={{ color: "#722ed1" }}
                />
              </div>
            </Col>
          </Row>
        ) : (
          <Empty description={t("profile.noStats")} />
        )}
      </Card>

      {/* Sección de permisos */}
      <div>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          marginBottom: 16,
          paddingBottom: 8,
          borderBottom: "1px solid #f0f0f0"
        }}>
          <LockOutlined style={{ marginRight: 8, color: "#1890ff" }} />
          <Title level={4} style={{ margin: 0 }}>
            {t("profile.permissionsLabel")}
          </Title>
        </div>
        {renderPermissions()}
      </div>

      <EditProfileModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
      />
    </PageContainer>
  );
};

export default ProfilePage;