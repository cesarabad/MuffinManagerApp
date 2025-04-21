import { Card, Button, Typography, Row, Col, Badge } from 'antd';
import styled from 'styled-components';
import ProductStockRow from '../product-stock-row/product-stock-row.component';
import { ProductContent } from '../../../models/stock/product-stock/product-stock-dto.model';

const { Title, Text } = Typography;

const StyledProductCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 6px;
  border: 2px solid #bcaa78;
  background-color: #faf7ed;
  
  .ant-card-head {
    background-color: #e9e1c3;
    border-radius: 6px 6px 0 0;
    border-bottom: 2px solid #bcaa78;
    
    .ant-card-head-title {
      padding: 12px 0;
      
      h3.ant-typography {
        margin-bottom: 0;
        font-size: 18px;
        font-weight: 600;
        color: #5c4d2e;
      }
    }
    
    .ant-card-extra {
      .primary-button {
        background-color: #8e7840;
        border-color: #5c4d2e;
        
        &:hover {
          background-color: #5c4d2e;
          border-color: #5c4d2e;
        }
      }
    }
  }
  
  .ant-card-body {
    padding: 16px;
  }
  
  .product-info {
    border-right: 1px dashed #bcaa78;
    padding-right: 16px;
    height: 100%;
    
    .product-descriptor {
      margin-bottom: 8px;
      display: block;
      font-size: 15px;
    }
    
    .product-version {
      margin-bottom: 8px;
    }
    
    .product-box {
      margin-bottom: 8px;
      font-weight: 500;
    }
    
    .product-items {
      color: #8e7840;
      font-weight: 600;
      font-size: 16px;
    }
  }
  
  .stock-summary {
    background-color: #f3edd8;
    padding: 8px 12px;
    border-radius: 4px;
    margin-top: 12px;
    display: inline-block;
    font-weight: bold;
    border: 1px solid #bcaa78;
  }
  
  @media (max-width: 768px) {
    .ant-card-head {
      flex-direction: column;
      
      .ant-card-head-title {
        text-align: center;
      }
      
      .ant-card-extra {
        margin: 8px 0;
      }
    }
    
    .product-info {
      border-right: none;
      border-bottom: 1px dashed #bcaa78;
      padding-right: 0;
      padding-bottom: 16px;
      margin-bottom: 16px;
    }
  }
`;

interface ProductRowProps {
  product: ProductContent;
}

export function ProductRow({ product }: ProductRowProps) {
  // Calcular el stock total sumando todos los detalles de stock
  const totalStock = product.stockDetails.reduce((sum, item) => sum + item.stock, 0);
  
  return (
    <StyledProductCard
      title={<Title level={4}>{product.product.reference}</Title>}
      className="product-card"
      extra={
        <Button type="primary" onClick={() => alert('Ver histórico')} className="primary-button">
          Histórico
        </Button>
      }
    >
      <Row gutter={[16, 16]}>
        {/* Información del producto (izquierda en PC) */}
        <Col xs={24} md={6} lg={5} className="product-info">
          <Text strong className="product-descriptor">
            {product.product.description}
          </Text>
          
          {product.product.aliasVersion && (
            <Text type="secondary" className="product-version">
              Versión: {product.product.aliasVersion}
            </Text>
          )}
          
          <Text className="product-box">
            Caja: {product.product.boxReference} - {product.product.boxDescription}
          </Text>
          
          <Text className="product-items">
            <br/>{product.product.itemsPerProduct} UDS/caja
          </Text>
          <br/>
          <div className="stock-summary">
            Stock Total: <Badge 
              count={totalStock} 
              showZero
              overflowCount={100000} 
              style={{ 
                backgroundColor: totalStock > 0 ? '#52c41a' : '#f5222d',
                fontSize: '14px',
                fontWeight: 'bold'
              }} 
            /> cajas
          </div>
        </Col>
        
        {/* Detalles de stock (derecha en PC) */}
        <Col xs={24} md={18} lg={19}>
          <Row gutter={[12, 12]}>
            {product.stockDetails.map((productStock) => (
              <Col xs={24} md={12} lg={8} xl={6} key={productStock.id}>
                <ProductStockRow productStock={productStock} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </StyledProductCard>
  );
}

export default ProductRow;