import { Card, Button, Typography, Badge } from 'antd';
import styled from 'styled-components';
import { ProductStockResponseDto } from "../../../models/stock/product-stock/product-stock-dto.model";

const { Text } = Typography;

const StyledStockCard = styled(Card)`
  border-radius: 4px;
  border: 2px solid #d4c9a8;
  background-color: #fffdf7;
  margin: 0 auto;

  
  .ant-card-body {
    padding: 12px;
  }
  
  .stock-batch {
    font-size: 16px;
    font-weight: 600;
    color: #5c4d2e;
    display: block;
    margin-bottom: 8px;
  }
  
  .print-button {
    background-color: #f5ecd5;
    border-color: #d4c9a8;
    color: #5c4d2e;
    font-weight: 600;
    height: 32px;
    margin-bottom: 8px;
    
    &:hover {
      background-color: #e9e1c3;
      border-color: #bcaa78;
      color: #3c3012;
    }
  }
  
  .stock-value {
    background-color: #f3edd8;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 600;
    display: inline-block;
    color: #5c4d2e;
    border: 1px solid #d4c9a8;
    margin-bottom: 8px;
  }
  
  .stock-reserves {
    font-size: 13px;
    margin-bottom: 8px;
  }
  
  .stock-observations {
    font-style: italic;
    color: #8c8c8c;
    font-size: 13px;
    margin-bottom: 12px;
    padding: 4px 8px;
    background-color: #faf7ed;
    border-radius: 4px;
    border: 1px dashed #d4c9a8;
  }
  
  .stock-action-buttons {
    display: flex;
    gap: 8px;
    margin-top: 8px;
    
    .action-button {
      flex: 1;
      height: 32px;
      font-weight: 500;
      border-width: 1px;
    }
    
    .adjust-button {
      background-color: #8e7840;
      border-color: #5c4d2e;
      color: white;
      
      &:hover {
        background-color: #5c4d2e;
      }
    }
    
    .reserves-button {
      background-color: #d4c9a8;
      border-color: #bcaa78;
      color: #5c4d2e;
      
      &:hover {
        background-color: #e9e1c3;
      }
    }
    
    .history-button {
      background-color: #f5ecd5;
      border-color: #d4c9a8;
      color: #5c4d2e;
      
      &:hover {
        background-color: #e9e1c3;
      }
    }
  }

    .reserves-wrapper {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    flex-wrap: wrap;

    @media (max-width: 480px) {
      flex-direction: column;
      align-items: stretch;

      button {
        width: 100%;
      }

      div {
        width: 100%;
      }
    }
  }

  @media (min-width: 1000px) and (max-width: 1280px) {
    .stock-reserves {
      flex-direction: column !important;
      align-items: stretch;
      gap: 8px;

      button {
        width: 100%;
      }

      div {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        width: 100%;
      }
    }

    width: 100%;
    .ant-card-body {
      padding: 8px;
    }

    .stock-batch {
      font-size: 14px;
    }

    .print-button {
      height: 28px;
      font-size: 12px;
    }

    .stock-value {
      font-size: 13px;
      padding: 4px 6px;
    }

    .stock-reserves {
      font-size: 12px;
    }

    .stock-observations {
      font-size: 12px;
      padding: 4px 6px;
    }

    .stock-action-buttons {
      flex-direction: column;
      gap: 6px;

      .action-button {
        height: 30px;
        font-size: 13px;
      }
    }

    .reserves-wrapper {
      flex-direction: column;
      gap: 6px;

      button {
        width: 100%;
        font-size: 13px;
        height: 30px;
      }

      div {
        width: 100%;
      }
    }
    
  }


`;

interface ProductStockRowProps {
  productStock: ProductStockResponseDto;
}

export function ProductStockRow({ productStock }: ProductStockRowProps) {
  return (
    <StyledStockCard className="product-stock-card">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Text className="stock-batch">{productStock.batch}</Text>
          
          {productStock.packagePrint && (
            <Button 
              className="print-button" 
              onClick={() => alert(`Imprimir etiqueta: ${productStock.packagePrint.reference} - ${productStock.packagePrint.description}`)}
            >
              {productStock.packagePrint.reference}
            </Button>
          )}
        </div>
        {productStock.observations && (
          <div className="stock-observations">
            {productStock.observations}
          </div>
        )}
        <div className="stock-value" style={{ width: '100%', textAlign: 'center' }}>
          Stock: <Badge 
            count={productStock.stock > 100 ? productStock.stock : productStock.stock} 
            overflowCount={100000} 
            style={{ 
              backgroundColor: productStock.stock > 0 ? '#52c41a' : '#f5222d',
              fontSize: '14px'
            }} 
          /> cajas
        </div>
        
        {productStock.reserves.length > 0 && (
          <div className="stock-reserves" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Button 
              className="action-button reserves-button" 
              onClick={() => alert('Consultar reservas')}
              style={{ height: '30px' }}
            >
              Reservas
            </Button>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {productStock.reserves.map((reserve, index) => (
                <Badge 
                  key={index}
                  count={`${reserve.destination}: ${reserve.units}c`} 
                  style={{ backgroundColor: '#faad14', fontSize: '13px' }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="stock-action-buttons">
          
          <Button 
            className="action-button adjust-button" 
            onClick={() => alert('Ajustar stock')}
          >
            Ajustar
          </Button>
          <Button 
            className="action-button history-button" 
            onClick={() => alert('Ver histórico')}
          >
            Histórico
          </Button>
        </div>
      </div>
    </StyledStockCard>
  );
}

export default ProductStockRow;