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

  & .ant-card-head {
    background-color: #d8c99a !important; /* fuerza su propio color, evita herencia */
    border-radius: 6px 6px 0 0;
    border-bottom: 2px solid #bcaa78;
    text-align: left;

    & .ant-card-head-title {
      padding: 12px 0;
      word-wrap: break-word;
      white-space: normal;
      text-align: left;

      & h3.ant-typography {
        margin-bottom: 0;
        font-size: 18px;
        font-weight: 600;
        color: #5c4d2e;
        text-align: left;
      }
    }

    & .ant-card-extra {
      & .primary-button {
        background-color: #8e7840;
        border-color: #5c4d2e;

        &:hover {
          background-color: #5c4d2e;
          border-color: #5c4d2e;
        }
      }
    }
  }

  & .ant-card-body {
    padding: 16px;
  }

  & .product-info {
    border-right: 1px dashed #bcaa78;
    padding-right: 16px;
    height: 100%;

    & .product-descriptor {
      margin-bottom: 8px;
      display: block;
      font-size: 15px;
    }

    & .product-version {
      margin-bottom: 8px;
    }

    & .product-box {
      margin-bottom: 8px;
      font-weight: 500;
    }

    & .product-items {
      color: #8e7840;
      font-weight: 600;
      font-size: 16px;
    }
  }

  & .stock-summary {
    background-color: #f3edd8;
    padding: 8px 12px;
    border-radius: 4px;
    margin-top: 12px;
    display: inline-block;
    font-weight: bold;
    border: 1px solid #bcaa78;
  }

  .mobile-button {
    display: none;
  }

  @media (max-width: 868px) {
  & .ant-card-head {
    flex-direction: column;
    align-items: center;

    & .ant-card-head-title {
      text-align: center;
      h4.ant-typography {
        font-size: 16px !important;
      }
    }

    & .ant-card-extra {
      display: none; /* Oculta el botón original en móvil */
    }
  }

  .mobile-button {
    display: block;
    width: 100%;
    margin-top: 10px;

    .primary-button {
      width: 100%; /* Ocupa el 100% del contenedor */
      background-color: #8e7840;
      border-color: #5c4d2e;
      color: white;
      font-weight: 600;
      height: 40px;

      &:hover {
        background-color: #5c4d2e;
        border-color: #5c4d2e;
      }
    }
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
    title={
      <div>
        <Title level={4} style={{ margin: 0 }}>
          {product.product.reference} - {product.product.description}
          {product.product.aliasVersion && (
            <span style={{ fontWeight: 400, fontSize: '90%' }}>
              <br />({product.product.aliasVersion})
            </span>
          )}
        </Title>
        <div className="mobile-button">
          <Button
            type="primary"
            onClick={() => alert('Ver histórico')}
            className="primary-button"
          >
            Histórico
          </Button>
        </div>
      </div>
    }
    
    
    
      className="product-card"
      extra={
        <Button type="primary" onClick={() => alert('Ver histórico')} className="primary-button">
          Histórico
        </Button>
      }
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6} lg={5} className="product-info">
          
          
          
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
