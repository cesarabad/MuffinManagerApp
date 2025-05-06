import React from 'react';
import { Form, Input, Checkbox, Row, Col, Space, Tag, FormInstance } from 'antd';
import { IdcardOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { validateDni } from '../../../../utils/validate-dni';

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
    >
      {isEdit && (
        <>
          <Form.Item name="id" hidden><Input /></Form.Item>
          <Form.Item 
            name="disabled" 
            valuePropName="checked"
            style={{ marginBottom: 24 }}
            label={
                <Space>
                  <UserOutlined />
                  {t("profile.activateUserLabel")}
                </Space>
              }
            >
                <Checkbox style={{ display: 'none' }}>
                </Checkbox>

                <Form.Item 
                    noStyle 
                    shouldUpdate={(prevValues, currentValues) => prevValues.disabled !== currentValues.disabled}
                >
                    {({ getFieldValue, setFieldsValue }) => {
                    const disabled = getFieldValue('disabled');

                    return (
                        <Tag
                        color={disabled ? "red" : "green"}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setFieldsValue({ disabled: !disabled })}
                        >
                        {t(disabled ? "profile.isDisabledLabel" : "profile.isEnabledLabel")}
                        </Tag>
                    );
                    }}
                </Form.Item>
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
            rules={[
              { required: true, message: t("validation.required") },
              () => ({
          validator(_, value) {
            if (!value || validateDni(value)) {
              return Promise.resolve();
            }
            return Promise.reject(new Error(t("validation.dni")));
          },
              }),
            ]}
          >
            <Input placeholder={t('profile.dniPlaceholder')} />
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
            <Input placeholder={t('profile.namePlaceholder')} />
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
            <Input placeholder={t('profile.secondNamePlaceholder')} />
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