import React from 'react';
import { Form, Input, Checkbox, Row, Col, Space, Tag, FormInstance } from 'antd';
import { IdcardOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

interface BasicInfoTabProps {
  form: FormInstance;
  isEdit: boolean;
  onFinish: (values: any) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ form, isEdit, onFinish }) => {
  const { t } = useTranslation();

  return (
    <Form 
      form={form} 
      layout="vertical" 
      onFinish={onFinish}
      requiredMark="optional"
    >
      {isEdit && (
        <>
          <Form.Item name="id" hidden><Input /></Form.Item>
          <Form.Item 
            name="disabled" 
            valuePropName="checked"
            style={{ marginBottom: 24 }}
          >
            <Checkbox>
              <Tag color="red">{t("profile.isDisabledLabel")}</Tag>
            </Checkbox>
          </Form.Item>
        </>
      )}

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label={
              <Space>
                <IdcardOutlined />
                {t("profile.dniLabel")}
              </Space>
            }
            name="dni"
            rules={[{ required: true, message: t("validation.required") }]}
          >
            <Input placeholder="12345678A" />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={12}>
          <Form.Item
            label={
              <Space>
                <UserOutlined />
                {t("profile.nameLabel")}
              </Space>
            }
            name="name"
            rules={[{ required: true, message: t("validation.required") }]}
          >
            <Input placeholder="John" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24}>
          <Form.Item
            label={
              <Space>
                <UserOutlined />
                {t("profile.secondNameLabel")}
              </Space>
            }
            name="secondName"
            rules={[{ required: true, message: t("validation.required") }]}
          >
            <Input placeholder="Doe" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label={
              <Space>
                <KeyOutlined />
                {isEdit ? t("profile.newPasswordLabel") : t("profile.passwordLabel")}
              </Space>
            }
            name="newPassword"
            rules={[
              { min: 6, message: t("validation.passwordMinLength", { min: 6 }) },
              { required: !isEdit, message: t("validation.required") }
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={12}>
          <Form.Item
            label={
              <Space>
                <KeyOutlined />
                {t("profile.confirmPasswordLabel")}
              </Space>
            }
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t("validation.passwordsMustMatch")));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default BasicInfoTab;