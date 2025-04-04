import { Outlet } from 'react-router-dom';
import { Layout as AntLayout, Menu } from 'antd';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Header, Content, Footer } = AntLayout;

const Layout = ({ showMenu }: { showMenu: boolean }) => {
  const location = useLocation(); // Obtener la ruta actual
  const { t } = useTranslation(); // Usar i18next para traducciones
  // Estilo para centrar la imagen en login
  const isLoginPage = location.pathname === '/login';

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {/* Header con logo */}
      <Header
        style={{
          position: 'fixed', // Hacer el header fijo
          top: 0,
          left: isLoginPage ? 0 : -25,
          right: 0,
          zIndex: 1000, // Asegura que esté por encima de otros elementos
          display: 'flex',
          alignItems: 'center',
          justifyContent: isLoginPage ? 'center' : 'flex-start', // Centrar la imagen en login
          backgroundColor: '#001529', // Fondo para el header
        }}
      >
        <img
          src="/src/assets/img/mdlh-logo.png"
          alt="Logo"
          style={{
            height: '45px',
            marginRight: '18px',
            display: 'block',
          }}
        />
        
        {/* Menú visible solo si showMenu es true */}
        {showMenu && (
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ flex: 1 }}>
            <Menu.Item key="1">Inicio</Menu.Item>
            <Menu.Item key="2">Dashboard</Menu.Item>
          </Menu>
        )}
      </Header>

      {/* Aquí se renderizan las páginas hijas */}
      <Content
        style={{
          padding: '20px',
          marginTop: '64px', // Esto da espacio para el header fijo
          minHeight: 'calc(100vh - 128px)', // Asegura que el contenido no se solape con el footer
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
          backgroundColor: '#f5f5f5', // Fondo para el footer
        }}
      >
        {t("layout.footer")}
      </Footer>
    </AntLayout>
  );
};

export default Layout;
