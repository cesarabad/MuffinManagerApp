import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/auth/auth.context';

const LogoutButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout().then(() => {
      navigate('/login');
    })
  };

  return (
    <Button
      type="primary"
      danger
      onClick={handleLogout}
      style={{
        borderRadius: '12px',
        backgroundColor: '#D27A7A',
        borderColor: '#D27A7A',
      }}
    >
      {t('auth.logout')}
    </Button>
  );
};

export default LogoutButton;
