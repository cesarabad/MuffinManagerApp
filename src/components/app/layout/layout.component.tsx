import { Outlet, useNavigate } from 'react-router-dom';
import { Layout as AntLayout, Menu } from 'antd';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LogoutButton from '../buttons/logout/LogoutButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faWrench } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../contexts/auth/auth.context';
import { Permission } from '../../../models/auth/permisos.model';
import { PrivateRoutes } from '../../../models/routes';

const { Header, Content, Footer } = AntLayout;

const Layout = () => {
  const location = useLocation(); // Obtener la ruta actual
  const { t } = useTranslation(); // Usar i18next para traducciones
  const isLoginPage = location.pathname === '/login';
  const { hasPermission, isAuthenticated } = useAuth();
  const navigate = useNavigate();


  const handleMenuClick = (key: string) => {
    switch (key) {
      case `${PrivateRoutes.HOME}`:
        navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.HOME}`);
        break;
      case `${Permission.ManageData}`:
        navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.MANAGE_DATA}`);
        break;
      case `${Permission.ManageStock}`:
        //window.location.href = `/${PrivateRoutes}`;
        break;
      case `${Permission.ManageUsers}`:
        //window.location.href = `/${PublicRoutes.MANAGE_USERS}`;
        break;
      default:
        break;
    }
  }

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {/* Header con logo */}
      <Header
        style={{
          position: 'fixed',
          top: 0,
          left: isLoginPage ? 0 : -25,
          right: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isLoginPage ? 'center' : 'flex-start',
          backgroundColor: '#001529',
        }}
      >
        <a href="/"><img
          src="/src/assets/img/mdlh-logo.png"
          alt="Logo"
          style={{
            height: '45px',
            marginRight: '18px',
            display: 'block',
          }}
        /></a>

        {/* Menú visible solo si no estamos en la página de login */}
        {!isLoginPage && (
          <div style={{ flex: 1, display: 'flex' }}>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['1']}
              style={{
                width: '100%',
                margin: '0 auto',
                fontSize: '16px',
                borderBottom: 'none',
                justifyContent: 'flex-end',
              }}
              onClick={({ key }) => handleMenuClick(key)}
            >

              {isAuthenticated() && (<Menu.Item key={`${PrivateRoutes.HOME}`}>
                {t("layout.menu.home")}
              </Menu.Item>)}
              
              <Menu.SubMenu
                key="management"
                title={<FontAwesomeIcon icon={faWrench} />}
                popupClassName="submenu-dark"
              >
                {hasPermission(Permission.ManageData) && (<><Menu.Item key={`${Permission.ManageData}`}>{t('layout.menu.manageData')}</Menu.Item>
                  <Menu.Divider style={{ backgroundColor: 'rgba(77, 166, 255, 0.2)' }} /></>)}
                
                {hasPermission(Permission.ManageStock) && (<><Menu.Item key={`${Permission.ManageStock}`}>{t('layout.menu.manageStock')}</Menu.Item>
                  <Menu.Divider style={{ backgroundColor: 'rgba(77, 166, 255, 0.2)' }} /></>)}
                
                {hasPermission(Permission.ManageUsers) && (<Menu.Item key={`${Permission.ManageUsers}`}>{t('layout.menu.manageUsers')}</Menu.Item>)}
              </Menu.SubMenu>
              
              <Menu.SubMenu
                key="user"
                title={<FontAwesomeIcon icon={faUser} />}
                popupClassName="submenu-dark"
              >
                <Menu.Item
                  key="logout">
                  <LogoutButton />
                </Menu.Item>
              </Menu.SubMenu>
            </Menu>
          </div>
        )}
      </Header>

      {/* Aquí se renderizan las páginas hijas */}
      <Content
        style={{
          padding: '20px',
          marginTop: '64px', 
          minHeight: 'calc(100vh - 128px)', 
          backgroundColor: '#FFF8E1', // Crema claro para el fondo de la página
        }}
      >
        <Outlet />
      </Content>

      {/* Footer fijo */}
      <Footer
        style={{
          position: 'fixed', // Hacer el footer fijo
          bottom: 0,
          fontWeight: 'bold',
          color: '#403d39',
          left: 0,
          right: 0,
          textAlign: 'center',
          backgroundColor: '#f5f5f5',
          zIndex: 1000,
        }}
      >
        {t("layout.footer")}
      </Footer>
    </AntLayout>
  );
};

export default Layout;
