import { Outlet, useNavigate } from 'react-router-dom';
import { Layout as AntLayout, Menu } from 'antd';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LogoutButton from '../buttons/logout/LogoutButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faWrench } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../contexts/auth/auth.context';
import { Permission } from '../../../models/auth/permission.model';
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
        navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.STOCK}`);
        break;
      case `${Permission.ManageUsers}`:
        //window.location.href = `/${PublicRoutes.MANAGE_USERS}`;
        break;
      case `profile`:
        navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.PROFILE}`);
        break;
      default:
        break;
    }
  }

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          position: 'fixed',
          top: 0,
          left: isLoginPage ? 0 : -25,
          right: 0,
          zIndex: 99,
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
                {(hasPermission(Permission.ManageData) || hasPermission(Permission.GetData)) && (<><Menu.Item key={`${Permission.ManageData}`}>{t('layout.menu.manageData')}</Menu.Item>
                  <Menu.Divider style={{ backgroundColor: 'rgba(77, 166, 255, 0.2)' }} /></>)}
                
                {(hasPermission(Permission.ManageStock) || hasPermission(Permission.GetStock)) && (<><Menu.Item key={`${Permission.ManageStock}`}>{t('layout.menu.manageStock')}</Menu.Item>
                  <Menu.Divider style={{ backgroundColor: 'rgba(77, 166, 255, 0.2)' }} /></>)}
                
                {hasPermission(Permission.ManageUsers) && (<Menu.Item key={`${Permission.ManageUsers}`}>{t('layout.menu.manageUsers')}</Menu.Item>)}
              </Menu.SubMenu>
              
              <Menu.SubMenu
                key="user"
                title={<FontAwesomeIcon icon={faUser} />}
                popupClassName="submenu-dark"
              >
                <Menu.Item
                  key="profile">
                  {t("layout.menu.profile")}
                </Menu.Item>
                <Menu.Item
                  key="logout">
                  <LogoutButton />
                </Menu.Item>
              </Menu.SubMenu>
            </Menu>
          </div>
        )}
      </Header>

      <Content
        style={{
          padding: '20px',
          marginTop: '64px', 
          minHeight: 'calc(100vh - 128px)', 
          backgroundColor: '#FFF8E1',
        }}
      >
        <Outlet />
      </Content>

      <Footer
        style={{
          position: 'fixed',
          bottom: 0,
          fontWeight: 'bold',
          color: '#403d39',
          left: 0,
          right: 0,
          textAlign: 'center',
          backgroundColor: '#f5f5f5',
          zIndex: 99,
        }}
      >
        {t("layout.footer")}
      </Footer>
    </AntLayout>
  );
};

export default Layout;
