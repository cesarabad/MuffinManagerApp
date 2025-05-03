import { useEffect } from "react";
import { Modal, Form, Input, Divider } from "antd";
import { useTranslation } from "react-i18next";
import { User } from "../../../models/index.model";
import { useAuth } from "../../../contexts/auth/auth.context";
import { toast } from "react-toastify";

interface ProfileDataManagerModalProps {
  open: boolean;
  onClose: () => void;
  user?: User;
}

const ProfileDataManagerModal: React.FC<ProfileDataManagerModalProps> = ({ open, onClose, user }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { updateUser, createUser } = useAuth();
  const isEdit = !!user;

  const handleSubmit = async (values: any) => {
    try {
      if (isEdit) {
        await updateUser(values);
      } else {
        await createUser(values);
      }
      onClose();
    } catch (error) {
      toast.error(t("error.password"));
    }
  };

  useEffect(() => {
    if (open) {
      if (isEdit) {
        form.setFieldsValue({
          id: user?.id,
          dni: user?.dni,
          name: user?.name,
          secondName: user?.secondName,
          password: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        form.resetFields();
      }
    }
  }, [user, open, form]);

  return (
    <Modal
      title={isEdit ? t("profile.editTitle") : t("profile.createTitle")}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={isEdit ? t("button.update") : t("button.create")}
      cancelText={t("button.cancel")}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
      {isEdit && (
        <Form.Item name="id" hidden>
        <Input />
        </Form.Item>
      )}

      <Form.Item
        label={t("profile.dniLabel")}
        name="dni"
        rules={[{ required: true, message: t("validation.required") }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("profile.nameLabel")}
        name="name"
        rules={[{ required: true, message: t("validation.required") }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("profile.secondNameLabel")}
        name="secondName"
        rules={[{ required: true, message: t("validation.required") }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("profile.newPasswordLabel")}
        name="newPassword"
        rules={[
        { min: 6, message: t("validation.passwordMinLength", { min: 6 }) },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label={t("profile.confirmPasswordLabel")}
        name="confirmPassword"
        dependencies={['newPassword']}
        rules={[
        { required: !isEdit, message: t("validation.required") },
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

      <Divider orientation="left" plain style={{ marginTop: "40px", marginBottom: '10px' }} />
      <strong>{t("profile.verificationSectionTitle")}</strong>

      <Form.Item
        label={t("profile.passwordLabel")}
        name="password"
        style={{ marginTop: '30px' }}
        rules={[
        { required: true, message: t("validation.required") },
        { min: 6, message: t("validation.passwordMinLength", { min: 6 }) },
        ]}
      >
        <Input.Password />
      </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProfileDataManagerModal;
