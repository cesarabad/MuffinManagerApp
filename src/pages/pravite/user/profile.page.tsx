import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Space,
  Popconfirm,
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
  ArrowLeftOutlined,
  StopOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import PageContainer from "../../../components/app/generic-page-container/PageContainer.component";
import ProfileDataManagerModal from "../../../components/user/edit-modal/profile-data-manager-modal.component";
import { userService } from "../../../services/user/user.service";
import { PrivateRoutes } from "../../../models/routes";
import { User } from "../../../models/auth/user.model";
import { UserDetailedDto } from "../../../models/auth/user-detailed-dto.model";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const { user: currentUser, hasPermission, getDetailedUser } = useAuth();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [detailedUser, setDetailedUser] = useState<UserDetailedDto | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      // If userId is provided and the user has permission to manage users, fetch that user
      if (userId && hasPermission(Permission.ManageUsers)) {
        try {
          setLoadingProfile(true);
          const userDetailed = await getDetailedUser(parseInt(userId));
          setDetailedUser(userDetailed);
          
          // Create a User object from UserDetailedDto for compatibility
          const userObj: User = {
            id: userDetailed.id,
            dni: userDetailed.dni,
            name: userDetailed.name,
            secondName: userDetailed.secondName,
            permissions: userDetailed.permissions.map(p => p.name as Permission),
            token: ''
          };
          
          setProfileUser(userObj);
          setIsOwnProfile(userId === currentUser?.id.toString());
          
          fetchUserStats(parseInt(userId));
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error(t("error.fetchingUser"));
          setProfileUser(currentUser);
          setIsOwnProfile(true);
          
          if (currentUser) {
            fetchUserStats(currentUser.id);
          }
        } finally {
          setLoadingProfile(false);
        }
      } else {
        // Use the current logged-in user
        setProfileUser(currentUser);
        setIsOwnProfile(true);
        
        // Get detailed user data for current user
        if (currentUser) {
          try {
            const userDetailed = await getDetailedUser(currentUser.id);
            setDetailedUser(userDetailed);
            fetchUserStats(currentUser.id);
          } catch (error) {
            console.error("Error fetching detailed user data:", error);
            fetchUserStats(currentUser.id);
          }
        }
      }
    };

    fetchUserData();
  }, [userId, currentUser, hasPermission, t, getDetailedUser]);

  const fetchUserStats = (id: number) => {
    setLoadingStats(true);
    userService
      .getStats(id)
      .then((response) => {
        setStats(response);
      })
      .catch((err) => {
        console.error("Error loading user stats:", err);
      })
      .finally(() => setLoadingStats(false));
  };

  // Function to handle user disable/enable
  const handleToggleUserStatus = async () => {
    if (!detailedUser) return;
    
    try {
      // In a real implementation, call an API to disable/enable user
      alert('No implementado');
      
      // For UI demonstration, toggle the status locally
      setDetailedUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          isDisabled: !prev.isDisabled
        };
      });
      
      toast.success(t(detailedUser.isDisabled ? "user.enabled" : "user.disabled"));
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error(t("error.userStatusChange"));
    }
  };

  // Function to get a color according to permission category
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

  // Extract permission map from detailedUser for easier permission checking
  const getUserPermissionMap = (): { [key: string]: boolean } => {
    if (!detailedUser) return {};
    
    const permMap: { [key: string]: boolean } = {};
    
    // Add direct permissions
    detailedUser.permissions.forEach(p => {
      permMap[p.name] = true;
    });
    
    // Add permissions from groups
    detailedUser.groups.forEach(group => {
      group.permissions.forEach(p => {
        permMap[p.name] = true;
      });
    });
    
    return permMap;
  };

  // Renders grouped permissions following the GroupedPermissions structure
  const renderPermissions = () => {
    if (!profileUser || !detailedUser) return null;

    const permissionMap = getUserPermissionMap();

    return Object.entries(GroupedPermissions).map(([groupKey, groupValue]) => {
      // Check if the group has subgroups
      const hasSubGroups = !Array.isArray(groupValue);
      
      // For groups with subgroups, check if there are permissions in any subgroup
      let hasAnyPermissions = false;
      
      const checkPermission = (perm: Permission) => {
        return permissionMap[perm] === true;
      };
      
      if (hasSubGroups) {
        // Check permissions in subgroups
        Object.entries(groupValue).forEach(([_, permissions]) => {
          const filteredPermissions = (permissions as Permission[]).filter(checkPermission);
          if (filteredPermissions.length > 0) {
            hasAnyPermissions = true;
          }
        });
      } else {
        // Check permissions in simple group
        hasAnyPermissions = (groupValue as Permission[]).some(checkPermission);
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
            // Show message when there are no permissions in this group
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
            // Render subgroups
            Object.entries(groupValue).map(([subGroupKey, permissions]) => {
              const filteredPermissions = (permissions as Permission[]).filter(checkPermission);
              
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
            // Render direct permissions
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(groupValue as Permission[])
                .filter(checkPermission)
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

  // Render groups section
  const renderGroups = () => {
    if (!detailedUser || !detailedUser.groups || detailedUser.groups.length === 0) {
      return (
        <Empty 
          description={t("profile.noGroups")} 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
        />
      );
    }

    return (
      <Row gutter={[16, 16]}>
        {detailedUser.groups.map(group => (
          <Col xs={24} md={12} lg={8} key={group.id}>
            <Card 
              title={group.name}
              size="small"
              style={{ borderRadius: 8 }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {group.permissions.map(perm => (
                  <Tag 
                    key={perm.id}
                    color="blue"
                  >
                    {perm.name}
                  </Tag>
                ))}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  // Loading state
  if (loadingProfile) {
    return (
      <PageContainer>
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  // Not authenticated state
  if (!profileUser || !detailedUser) {
    return (
      <PageContainer>
        <Empty 
          description={t("profile.notAuthenticated")} 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
        />
      </PageContainer>
    );
  }

  // Determine if current user can edit this profile
  const canEdit = isOwnProfile || 
    (hasPermission(Permission.ManageUsers) && 
     (currentUser?.id !== profileUser.id));
  
  // Determine if current user can disable this user
  const canDisable = !isOwnProfile && 
    hasPermission(Permission.ManageUsers) && 
    !profileUser.permissions.includes(Permission.Dev);

  const isDev = permissionIncluded(detailedUser, "dev");
  const isSuperAdmin = permissionIncluded(detailedUser, "super_admin");

  // Helper function to check if a permission is included
  function permissionIncluded(user: UserDetailedDto, permName: string): boolean {
    return !!user.permissions.find(p => p.name === permName) ||
           !!user.groups.find(g => g.permissions.find(p => p.name === permName));
  }

  return (
    <PageContainer>
      {!isOwnProfile && (
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(PrivateRoutes.MANAGE_USERS)}
          style={{ marginBottom: 16 }}
        >
          {t("button.backToUsers")}
        </Button>
      )}
      
      <Card
        style={{ 
          borderRadius: 8, 
          marginBottom: 24, 
          boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
          overflow: "hidden"
        }}
      >
        <Row gutter={24}>
          <Col xs={24} md={6} style={{ textAlign: "center" }}>
            <Avatar 
              size={120} 
              icon={<UserOutlined />} 
              style={{ 
                backgroundColor: !detailedUser.isDisabled ? "#1890ff" : "#d9d9d9",
                marginBottom: 16,
                boxShadow: !detailedUser.isDisabled ? "0 4px 12px rgba(24,144,255,0.3)" : "none"
              }} 
            />
            <Title level={3} style={{ margin: 0, color: !detailedUser.isDisabled ? 'inherit' : '#999' }}>
              {detailedUser.name} {detailedUser.secondName}
            </Title>
            {detailedUser.isDisabled && (
              <Tag color="error" style={{ margin: '8px 0' }}>
                {t("user.disabled")}
              </Tag>
            )}
            <div style={{ marginTop: 16 }}>
              <Space>
                {canEdit && (
                  <Button 
                    type="primary" 
                    onClick={() => setIsModalOpen(true)}
                    disabled={detailedUser.isDisabled && !isOwnProfile}
                  >
                    {t("button.edit")}
                  </Button>
                )}
                
                {canDisable && (
                  <Popconfirm
                    title={t(!detailedUser.isDisabled ? "user.confirmDisable" : "user.confirmEnable")}
                    onConfirm={handleToggleUserStatus}
                    okText={t("button.yes")}
                    cancelText={t("button.no")}
                  >
                    <Button 
                      danger={!detailedUser.isDisabled}
                      type={!detailedUser.isDisabled ? "primary" : "default"}
                      icon={!detailedUser.isDisabled ? <StopOutlined /> : <CheckOutlined />}
                    >
                      {!detailedUser.isDisabled ? t("button.disable") : t("button.enable")}
                    </Button>
                  </Popconfirm>
                )}
              </Space>
            </div>
          </Col>
          
          <Col xs={24} md={18}>
            <div style={{ padding: "0 16px" }}>
              <Title level={4} style={{ marginBottom: 16 }}>
                <UserOutlined style={{ marginRight: 8 }} />
                {t("profile.personalInfo")}
              </Title>
              
              <Row gutter={[16, 16]}>
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
                      <Text strong>{detailedUser.dni}</Text>
                    </div>
                  </Card>
                </Col>
                
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
                      <Text strong>{detailedUser.name}</Text>
                    </div>
                  </Card>
                </Col>
                
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
                      <Text strong>{detailedUser.secondName}</Text>
                    </div>
                  </Card>
                </Col>
                
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
                      color: isSuperAdmin ? "#f5222d" : 
                             isDev ? "#1890ff" : "#52c41a"
                    }}>
                      <Text strong>
                        {isDev
                          ? t('permission.dev') 
                          : isSuperAdmin
                            ? t('permission.super_admin')
                            : t('permission.employee')
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

      {/* Statistics Section */}
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

      {/* Groups Section */}
      <Card 
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <UserSwitchOutlined style={{ marginRight: 8, color: "#1890ff" }} />
            <Title level={4} style={{ margin: 0 }}>
              {t("profile.groupsLabel")}
            </Title>
          </div>
        }
        style={{ 
          borderRadius: 8, 
          marginBottom: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,0.09)"
        }}
      >
        {renderGroups()}
      </Card>

      {/* Permissions Section */}
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

      <ProfileDataManagerModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          // Refresh user data after modal closes if needed
          if (userId && hasPermission(Permission.ManageUsers)) {
            getDetailedUser(parseInt(userId))
              .then(userDetailed => {
                setDetailedUser(userDetailed);
                
                // Update profileUser as well
                const userObj: User = {
                  id: userDetailed.id,
                  dni: userDetailed.dni,
                  name: userDetailed.name,
                  secondName: userDetailed.secondName,
                  permissions: userDetailed.permissions.map(p => p.name as Permission),
                  token: ''
                };
                setProfileUser(userObj);
              })
              .catch(error => {
                console.error("Error refreshing user data:", error);
              });
          }
        }}
        detailedUser={detailedUser}
      />
    </PageContainer>
  );
};

export default ProfilePage;