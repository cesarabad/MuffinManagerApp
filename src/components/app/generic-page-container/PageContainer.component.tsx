// Página de contenedor (PageContainer)
import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
}

const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#F8E1C5', // Crema suave
        borderRadius: '12px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '100%',
        margin: '0 auto 50px',
        fontFamily: '"Roboto", sans-serif',
      }}
    >
      {children}
    </div>
  );
};

export default PageContainer;
