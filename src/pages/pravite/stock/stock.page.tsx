import { useEffect, useState } from 'react';
import { productStockService } from '../../../services/stock/product-stock.service';
import { StockResponse } from '../../../models/stock/product-stock/product-stock-dto.model';
import BrandRow from '../../../components/stock/brand-row/brand-row.component';
import { Button, Layout, message, Space } from 'antd';
import styled from 'styled-components';

const { Header, Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background-color: #f5ecd5;
`;

const StyledHeader = styled(Header)`
  background-color: #e9e1c3;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(92, 77, 46, 0.3);
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: auto;
  padding: 12px 24px;
  border-bottom: 2px solid #bcaa78;
  
  .header-space {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 12px;
    
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
      
      .ant-space-item {
        width: 100%;
        
        .ant-space {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 8px;
        }
      }
    }
  }
`;

const StyledContent = styled(Content)`
  padding: 24px;
  
  @media (max-width: 768px) {
    padding: 16px 8px;
  }
`;

const StyledButton = styled(Button)`
  &.primary-button {
    background-color: #8e7840;
    border-color: #5c4d2e;
    color: white;
    font-weight: 600;
    height: 40px;
    
    &:hover {
      background-color: #5c4d2e;
      border-color: #3c3012;
    }
  }
  
  &.secondary-button {
    background-color: #f5ecd5;
    border-color: #d4c9a8;
    color: #5c4d2e;
    font-weight: 600;
    height: 40px;
    
    &:hover {
      background-color: #e9e1c3;
      border-color: #bcaa78;
      color: #3c3012;
    }
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StockPage = () => {
  const [brands, setBrands] = useState<StockResponse>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await productStockService.getGroupedBy();
        setBrands(data);
      } catch (error) {
        console.error('Error fetching product stock:', error);
      }
    };

    fetchData();
  }, []);

  const showAlert = (msg: string) => message.info(msg);

  return (
    <StyledLayout>
      <StyledHeader>
        <Space wrap size="large" className="header-space">
          <Space size="middle">
            <StyledButton type="primary" onClick={() => showAlert('Realizar movimiento')} className="primary-button">
              Realizar movimiento
            </StyledButton>
            <StyledButton onClick={() => showAlert('Hacer recuento')} className="secondary-button">
              Hacer recuento
            </StyledButton>
            <StyledButton onClick={() => showAlert('Consultar reservas')} className="secondary-button">
              Consultar reservas
            </StyledButton>
            <StyledButton onClick={() => showAlert('Histórico')} className="secondary-button">
              Histórico
            </StyledButton>
          </Space>
        </Space>
      </StyledHeader>
      <StyledContent>
        {brands?.map((brand, index) => (
          <BrandRow brand={brand} key={index} />
        ))}
      </StyledContent>
    </StyledLayout>
  );
};

export default StockPage;