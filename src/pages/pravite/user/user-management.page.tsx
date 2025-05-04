import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Tag,
  Popconfirm,
  Typography,
  Row,
  Col,
  Tooltip,
  Badge,
  Empty,
  Spin,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  UserSwitchOutlined,
  CheckOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { UserSafeDto } from "../../../models/auth/user-safe-dto.model";
import { useAuth } from "../../../contexts/auth/auth.context";
import { Permission } from "../../../models/index.model";
import PageContainer from "../../../components/app/generic-page-container/PageContainer.component";
import ProfileDataManagerModal from "../../../components/user/edit-modal/profile-data-manager-modal.component";
import { UserDetailedDto } from "../../../models/auth/user-detailed-dto.model";
import { toast } from "react-toastify";
import { PrivateRoutes } from "../../../models/routes";
import { userService } from "../../../services/user/user.service";

const { Title } = Typography;

const UserManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasPermission, user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserSafeDto[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDetailedDto | null>(null);
  const [isManageUserDataModalOpen, setIsManageUserDataModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response);
      
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error(t("error.loadingUsers"));
      
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (userId: number) => {
    navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.PROFILE}/${userId}`);
  };

  const handleEditUser = async (userId: number) => {
    try {
      // Get detailed user information for editing
      const userDetailed = await userService.getDetailedUser(userId);
      setSelectedUser(userDetailed);
      setIsManageUserDataModalOpen(true);
    } catch (error) {
      toast.error(t("error.fetchingUser"));
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsManageUserDataModalOpen(true);
  };

  const handleManageUserDataModalClose = () => {
    setIsManageUserDataModalOpen(false);
  };

  const handleToggleUserStatus = async (userId: number) => {
    try {
      await userService.toggleDisabledUser(userId);
    } catch (error) {
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.secondName?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.dni.toLowerCase().includes(searchText.toLowerCase())
  );

  

const columns = [
    {
        title: t("profile.dniLabel"),
        dataIndex: "dni",
        key: "dni",
        render: (text: string, record: UserSafeDto) =>
            !record.disabled ? <Badge status="processing" text={text} /> : text,
    },
    {
        title: t("profile.nameLabel"),
        dataIndex: "name",
        key: "name",
    },
    {
        title: t("profile.secondNameLabel"),
        dataIndex: "secondName",
        key: "secondName",
    },
    {
        title: t("profile.statusLabel"),
        key: "isDisabled",
        render: (_: any, record: UserSafeDto) => (
            <Tag color={!record.disabled ? "success" : "error"}>
                {!record.disabled ? t("profile.statusActive") : t("profile.statusDisabled")}
            </Tag>
        ),
    },
    {
        title: t("profile.actionsLabel"),
        key: "actions",
        width: 180,
        render: (_: any, record: UserSafeDto) => (
            <Space size="small">
                <Tooltip title={t("button.view")}>
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => handleViewProfile(record.id)}
                    />
                </Tooltip>
                
                <Tooltip title={t("button.edit")}>
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEditUser(record.id)}
                        disabled={!hasPermission(Permission.ManageUsers)}
                    />
                </Tooltip>
                
                <Tooltip title={!record.disabled ? t("button.disable") : t("button.enable")}>
                    <Popconfirm
                        title={t(!record.disabled ? "user.confirmDisable" : "user.confirmEnable")}
                        onConfirm={() => handleToggleUserStatus(record.id)}
                        okText={t("button.yes")}
                        cancelText={t("button.no")}
                        disabled={!hasPermission(Permission.ManageUsers)}
                    >
                        <Button
                            danger={!record.disabled}
                            icon={!record.disabled ? <StopOutlined /> : <CheckOutlined />}
                            size="small"
                            disabled={!(hasPermission(Permission.ManageUsers) && currentUser?.id !== record.id)}
                        />
                    </Popconfirm>
                </Tooltip>
            </Space>
        ),
    },
];

  return (
    <PageContainer>
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <UserSwitchOutlined style={{ marginRight: 8, color: "#1890ff" }} />
            <Title level={4} style={{ margin: 0 }}>
              {t("profile.managementLabel")}
            </Title>
          </div>
        }
        style={{
          borderRadius: 8,
          marginBottom: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
        }}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddUser}
          >
            {t("profile.addUser")}
          </Button>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={8} lg={6}>
            <Input
              prefix={<SearchOutlined />}
              placeholder={t("search.placeholder")}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
        </Row>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Spin size="large" />
          </div>
        ) : users.length === 0 ? (
          <Empty
            description={t("user.noUsers")}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            style={{ marginTop: 16 }}
            locale={{ emptyText: t("table.noData") }}
            scroll={{ x: "max-content" }}
          />
        )}
      </Card>

      <ProfileDataManagerModal
        open={isManageUserDataModalOpen}
        onClose={handleManageUserDataModalClose}
        detailedUser={selectedUser || undefined}
      />
    </PageContainer>
  );
};

export default UserManagementPage;