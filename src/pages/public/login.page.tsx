import { Form, Input, Button, Card, Typography } from 'antd';
import { useAuth } from '../../contexts/auth/auth.context';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginFormValues, getLoginSchema } from '../../components/schemas/login.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PrivateRoutes } from '../../models/routes';

const { Title } = Typography;

const LoginPage = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(getLoginSchema(t)),
    mode: "onBlur",
    defaultValues: { dni: "", password: "" }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(data);
      navigate(`/${PrivateRoutes.PRIVATE}/`);
      location.reload();
    } catch (error) {
      console.error('Login failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <Title level={2} style={{ textAlign: 'center' }}>{t("login.title")}</Title>

        <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
          {/* DNI */}
          <Form.Item
            label={t("login.dniLabel")}
            validateStatus={errors.dni ? 'error' : ''}
            help={errors.dni?.message && (
              <span style={styles.errorText}>{errors.dni.message}</span>
            )}
          >
            <Controller
              name="dni"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={t("login.dniLabel")}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={t("login.passwordLabel")}
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message && (
              <span style={styles.errorText}>{errors.password.message}</span>
            )}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field} // Se conecta el campo a React Hook Form
                  placeholder={t("login.passwordLabel")}
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? t("login.loading") : t("login.submitButton")}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  card: {
    width: 400,
    padding: 20,
    borderRadius: 8,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  errorText: {
    fontSize: '12px',
    color: '#ff4d4f',
  },
};

export default LoginPage;
