import React from 'react';
import { Card, Form, Select, Tag, Typography, Row, Col, Divider, Space } from 'antd';
import { UsergroupAddOutlined, BulbOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { GroupEntity, PermissionEntity } from '../../../../models/index.model';

const { Title } = Typography;
const { Option } = Select;

interface GroupsTabProps {
  availableGroups: GroupEntity[];
  selectedGroups: number[];
  handleGroupChange: (value: number[]) => void;
  getGroupPermissionIds: () => number[];
  availablePermissions: PermissionEntity[];
  loading: boolean;
}

const GroupsTab: React.FC<GroupsTabProps> = ({ 
  availableGroups, 
  selectedGroups, 
  handleGroupChange, 
  getGroupPermissionIds, 
  availablePermissions,
  loading 
}) => {
  const { t } = useTranslation();

  return (
    <Card 
      bordered={false} 
      style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', borderRadius: '10px' }}
    >
      <Form.Item 
        label={
          <Space>
            <UsergroupAddOutlined />
            {t("profile.selectGroups")}
          </Space>
        }
      >
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder={t("profile.selectGroupsPlaceholder")}
          value={selectedGroups}
          onChange={handleGroupChange}
          optionFilterProp="children"
          showSearch
          loading={loading}
          tagRender={(props) => (
            <Tag 
              color="blue" 
              closable={props.closable} 
              onClose={props.onClose} 
              style={{ margin: '2px' }}
            >
              {props.label}
            </Tag>
          )}
        >
          {availableGroups.map(group => (
            <Option key={group.id} value={group.id}>{group.name}</Option>
          ))}
        </Select>
      </Form.Item>

      {selectedGroups.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <Title level={5} style={{ marginBottom: 16 }}>
            <BulbOutlined style={{ marginRight: 8 }} />
            {t("profile.selectedGroups")}
          </Title>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {selectedGroups.map(groupId => {
              const group = availableGroups.find(g => g.id === groupId);
              return group ? (
                <Tag
                  key={group.id}
                  color="blue"
                  closable
                  onClose={() => handleGroupChange(selectedGroups.filter(id => id !== group.id))}
                  style={{ margin: '0', padding: '6px 10px', fontSize: '14px' }}
                >
                  {group.name}
                </Tag>
              ) : null;
            })}
          </div>
        </div>
      )}
      
      {selectedGroups.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <Divider orientation="left">{t("profile.includedPermissions")}</Divider>
          <Row gutter={[16, 16]}>
            {getGroupPermissionIds().map(permId => {
              const permission = availablePermissions.find(p => p.id === permId);
              return permission ? (
                <Col key={permission.id} xs={24} sm={12} md={8} lg={6}>
                  <Tag 
                    color="green" 
                    style={{ padding: '4px 8px', marginBottom: 8 }}
                  >
                    {t(`permission.${permission.name}`)}
                  </Tag>
                </Col>
              ) : null;
            })}
          </Row>
        </div>
      )}
    </Card>
  );
};

export default GroupsTab;