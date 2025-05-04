// ProfilePage.tsx (Componente principal)
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/auth/auth.context";
import { Permission, UserStats } from "../../../models/index.model";
import { useTranslation } from "react-i18next";
import { Empty, Spin, Typography } from "antd";
import PageContainer from "../../../components/app/generic-page-container/PageContainer.component";
import ProfileDataManagerModal from "../../../components/user/edit-modal/profile-data-manager-modal.component";
import { userService } from "../../../services/user/user.service";
import { User } from "../../../models/auth/user.model";
import { UserDetailedDto } from "../../../models/auth/user-detailed-dto.model";
import { toast } from "react-toastify";

// Importar componentes modulares
import {
  BackButton,
  ProfileHeader,
  UserStatsCard,
  UserGroupsCard,
  UserPermissionsCard,
  UserRoleHelper
} from "../../../components/user/index";

const { Text } = Typography;

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const { user: currentUser, hasPermission, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [detailedUser, setDetailedUser] = useState<UserDetailedDto | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  
  // Estados para manejar expansiones
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});
  const [expandedPermissionGroups, setExpandedPermissionGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser && isAuthenticated()) {
        location.reload();
      }
      // If userId is provided and the user has permission to manage users, fetch that user
      if (userId && hasPermission(Permission.ManageUsers)) {
        try {
          setLoadingProfile(true);
          const userDetailed = await userService.getDetailedUser(parseInt(userId));
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
            const userDetailed = await userService.getDetailedUser(currentUser.id);
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
  }, [userId, currentUser, hasPermission, t]);

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
      toast.info(t("user.statusChangeInProgress"));
      
      // For UI demonstration, toggle the status locally
      setDetailedUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          disabled: !prev.disabled
        };
      });
      
      toast.success(t(detailedUser.disabled ? "user.enabled" : "user.disabled"));
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

  // Toggle permission group expansion
  const togglePermissionGroup = (groupKey: string) => {
    setExpandedPermissionGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  // Toggle group expansion
  const toggleGroup = (groupId: number) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // Loading state
  if (loadingProfile) {
    return (
      <PageContainer>
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <Spin size="large" />
          <div style={{ marginTop: 24 }}>
            <Text>{t("loading.userProfile")}</Text>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Not authenticated state
  if (!profileUser || !detailedUser) {
    return (
      <PageContainer>
        <Empty 
          description={<Text style={{ fontSize: 16 }}>{t("profile.notAuthenticated")}</Text>} 
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

  return (
    <PageContainer>
      {/* Back Button */}
      {!isOwnProfile && <BackButton t={t} />}
      
      {/* Profile Header */}
      <ProfileHeader
        detailedUser={detailedUser}
        canEdit={canEdit}
        canDisable={canDisable}
        isOwnProfile={isOwnProfile}
        t={t}
        onEdit={() => setIsModalOpen(true)}
        onToggleStatus={handleToggleUserStatus}
        userRole={<UserRoleHelper detailedUser={detailedUser} t={t} />}
      />

     
      
      {/* Statistics */}
      <UserStatsCard 
        stats={stats} 
        loading={loadingStats} 
        t={t} 
      />

      {/* Groups */}
      <UserGroupsCard 
        detailedUser={detailedUser} 
        t={t} 
        expandedGroups={expandedGroups} 
        toggleGroup={toggleGroup} 
      />

      {/* Permissions */}
      <UserPermissionsCard
        profileUser={profileUser}
        detailedUser={detailedUser}
        expandedPermissionGroups={expandedPermissionGroups}
        togglePermissionGroup={togglePermissionGroup}
        getPermissionColor={getPermissionColor}
        getUserPermissionMap={getUserPermissionMap}
      />

      {/* Edit Modal */}
      <ProfileDataManagerModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          // Refresh user data after modal closes if needed
          if (userId && hasPermission(Permission.ManageUsers)) {
            userService.getDetailedUser(parseInt(userId))
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