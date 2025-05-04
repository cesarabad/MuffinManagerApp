import { useTranslation } from "react-i18next";
import { GroupEntity, Permission, PermissionEntity } from "../../../../../models/index.model";
import { useAuth } from "../../../../../contexts/auth/auth.context";
import { Card, Table, Button, Space, Tag, Popconfirm, Tooltip, Modal, Empty, Spin, Typography } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, TeamOutlined } from "@ant-design/icons";
import { useState } from "react";
import Title from "antd/es/typography/Title";
const { Text } = Typography;

interface GroupManagementProps {
    onCreateGroup: () => void;
    onEditGroup: (group: GroupEntity) => void;
    onDeleteGroup?: (groupId: number) => void;
    groups: GroupEntity[];
    loading: boolean;
  }
  
  const GroupManagement: React.FC<GroupManagementProps> = ({
    onCreateGroup,
    onEditGroup,
    onDeleteGroup,
    groups,
    loading
  }) => {
    const { t } = useTranslation();
    const { hasPermission } = useAuth();
    const canManageGroups = hasPermission(Permission.ManageUsers);
  
    const columns = [
      {
        title: t("profile.groupNameLabel"),
        dataIndex: "name",
        key: "name",
        render: (text: string) => <Text strong>{text}</Text>
      },
      {
        title: t("profile.permissionCountLabel"),
        dataIndex: "permissions",
        key: "permissionsCount",
        render: (permissions: PermissionEntity[]) => (
          <Tag color="blue">{permissions.length}</Tag>
        )
      },
      {
        title: t("profile.actionsLabel"),
        key: "actions",
        width: 150,
        render: (_: any, record: GroupEntity) => (
          <Space size="small">
            <Tooltip title={t("button.view")}>
              <Button
                type="default"
                icon={<EyeOutlined />}
                size="small"
                onClick={() => handleViewPermissions(record)}
              />
            </Tooltip>
            {canManageGroups && (
              <>
                <Tooltip title={t("button.edit")}>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => onEditGroup(record)}
                  />
                </Tooltip>
                {onDeleteGroup && (
                  <Tooltip title={t("button.delete")}>
                    <Popconfirm
                      title={t("profile.confirmDeleteGroup")}
                      onConfirm={() => onDeleteGroup(record.id)}
                      okText={t("button.yes")}
                      cancelText={t("button.no")}
                    >
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                      />
                    </Popconfirm>
                  </Tooltip>
                )}
              </>
            )}
          </Space>
        )
      }
    ];
  
    // State for permission detail modal
    const [permissionDetailModalVisible, setPermissionDetailModalVisible] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<GroupEntity | null>(null);
  
    const handleViewPermissions = (group: GroupEntity) => {
      setSelectedGroup(group);
      setPermissionDetailModalVisible(true);
    };
  
    return (
      <>
        <Card
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <TeamOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              <Title level={5} style={{ margin: 0 }}>
                {t("profile.groupsManagement")}
              </Title>
            </div>
          }
          extra={
            canManageGroups && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onCreateGroup}
              >
                {t("profile.createGroup")}
              </Button>
            )
          }
          style={{ marginBottom: 24, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.09)" }}
        >
          <Spin spinning={loading}>
            {groups.length === 0 ? (
              <Empty description={t("profile.noGroups")} />
            ) : (
              <Table
                dataSource={groups}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                size="middle"
              />
            )}
          </Spin>
        </Card>
  
        {/* Modal para ver detalles de permisos */}
        <Modal
          title={selectedGroup ? `${t("profile.groupNameLabel")}: ${selectedGroup.name}` : ""}
          open={permissionDetailModalVisible}
          onCancel={() => setPermissionDetailModalVisible(false)}
          footer={null}
          width={600}
        >
          {selectedGroup && (
            <div>
              <Table
                dataSource={selectedGroup.permissions}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                columns={[
                  {
                    title: t("profile.permissionNameLabel"),
                    dataIndex: "name",
                    key: "name",
                    render: (name: string) => t(`permission.${name}`)
                  }
                ]}
              />
            </div>
          )}
        </Modal>
      </>
    );
  };
  export default GroupManagement;