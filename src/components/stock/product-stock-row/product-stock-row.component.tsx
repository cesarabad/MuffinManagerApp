import { Card, Button, Typography, Badge } from 'antd';
import styled from 'styled-components';
import { ProductStockResponseDto } from "../../../models/stock/product-stock/product-stock-dto.model";

const { Text } = Typography;

const StyledStockCard = styled(Card)`
  border-radius: 4px;
  border: 2px solid #d4c9a8;
  background-color: #fffdf7;
  height: 100%;
  
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
`;

interface ProductStockRowProps {
  productStock: ProductStockResponseDto;
}

export function ProductStockRow({ productStock }: ProductStockRowProps) {
  return (
    <StyledStockCard className="product-stock-card">
      <div>
        <Text className="stock-batch">{productStock.batch}</Text>
        
        {productStock.packagePrint && (
          <Button 
            className="print-button" 
            onClick={() => alert(`Imprimir etiqueta: ${productStock.packagePrint.reference} - ${productStock.packagePrint.description}`)}
          >
            {productStock.packagePrint.reference}
          </Button>
        )}
        
        <div className="stock-value">
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
          <Text className="stock-reserves">
            Reservado: {productStock.reserves.map(reserve => `${reserve.units} cajas para ${reserve.destination}`).join(" - ")}
          </Text>
        )}
        
        {productStock.observations && (
          <div className="stock-observations">
            {productStock.observations}
          </div>
        )}

        <div className="stock-action-buttons">
          {productStock.reserves.length > 0 && (
            <Button 
              className="action-button reserves-button" 
              onClick={() => alert('Consultar reservas')}
            >
              Reservas
            </Button>
          )}
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