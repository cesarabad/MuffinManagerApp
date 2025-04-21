import { Card, Typography } from 'antd';
import styled from 'styled-components';
import ProductRow from '../product-row/product-row.component';
import { MuffinShapeContent } from '../../../models/stock/product-stock/product-stock-dto.model';

const { Title } = Typography;

// Paleta de colores contrastados
const MUFFIN_SHAPE_COLORS = [
  { bg: '#e9f5e2', border: '#85c066', header: '#4b823a' }, // Verde
  { bg: '#e2eef9', border: '#6ba5e7', header: '#2e5c9e' }, // Azul
  { bg: '#f9e8df', border: '#e39e73', header: '#a25a2a' }, // Naranja
  { bg: '#e8def8', border: '#ad7ee5', header: '#6b3fa0' }, // Morado
  { bg: '#f7e2e2', border: '#e47777', header: '#9e3a3a' }, // Rojo
];

const StyledMuffinCard = styled(Card)<{ $colorScheme: typeof MUFFIN_SHAPE_COLORS[0] }>`
  margin-bottom: 16px;
  border-radius: 8px;
  background-color: ${props => props.$colorScheme.bg};
  border: 2px solid ${props => props.$colorScheme.border};
  
  .ant-card-head {
    background-color: ${props => props.$colorScheme.header};
    border-radius: 6px 6px 0 0;
    border-bottom: 2px solid ${props => props.$colorScheme.border};
    
    .ant-card-head-title {
      padding: 12px 0;
      
      h2.ant-typography {
        margin-bottom: 0;
        font-size: 22px;
        color: white;
        font-weight: 600;
      }
    }
  }
  
  .ant-card-body {
    padding: 16px;
  }
  
  @media (max-width: 768px) {
    .ant-card-head-title {
      h2.ant-typography {
        font-size: 18px;
      }
    }
  }
`;

export function MuffinShapeRow({ 
  muffinShape, 
  colorIndex = 0 
}: { 
  muffinShape: MuffinShapeContent; 
  colorIndex: number 
}) {
  const colorScheme = MUFFIN_SHAPE_COLORS[colorIndex % MUFFIN_SHAPE_COLORS.length];
  
  return (
    <StyledMuffinCard
      title={<Title level={3}>{muffinShape.muffinShape}</Title>}
      className="muffin-shape-card"
      $colorScheme={colorScheme}
    >
      {muffinShape.products.map((product, index) => (
        <ProductRow product={product} key={index} />
      ))}
    </StyledMuffinCard>
  );
}

export default MuffinShapeRow;