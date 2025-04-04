import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
}

const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <div
      style={{
        padding: '30px',
        backgroundColor: '#FFF8E1',
        minHeight: '100vh',
        borderRadius: '20px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      {children}
    </div>
  );
};

export default PageContainer;
