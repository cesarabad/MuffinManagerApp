import { Card, Divider, Image, Typography } from 'antd';
import styled from 'styled-components';
import MuffinShapeRow from '../muffin-shape-row/muffin-shape-row.component';
import { BrandContent } from '../../../models/stock/product-stock/product-stock-dto.model';

const { Title, Text } = Typography;

const StyledBrandCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  background-color: #fffbf0;
  border: 2px solid #d4c9a8;
  
  .ant-card-head {
    background-color: #f5ecd5;
    border-radius: 8px 8px 0 0;
    border-bottom: 2px solid #d4c9a8;
    display: flex;
    align-items: center;
    
    .ant-card-head-title {
      padding: 16px 0;
      
      h1.ant-typography {
        margin-bottom: 0;
        font-size: 28px;
        color: #5c4d2e;
        font-weight: 700;
      }
    }
    
    .ant-card-extra {
      display: flex;
      align-items: center;
      
      img {
        max-height: 80px;
        max-width: 150px;
      }
    }
  }
  
  @media (max-width: 768px) {
    .ant-card-head {
      flex-direction: column;
      
      .ant-card-head-title {
        text-align: center;
        
        h1.ant-typography {
          font-size: 22px;
        }
      }
    }
  }
`;

export function BrandRow({ brand }: { brand: BrandContent }) {
  return (
    <StyledBrandCard
      title={<Title level={2}>{brand.brandName}</Title>}
      className="brand-card"
      extra={
        brand.brandLogoBase64 && brand.brandLogoBase64.length > 0 ? (
          <Image
            src={`data:image/png;base64,${brand.brandLogoBase64}`}
            alt={`${brand.brandName} logo`}
            preview={false}
          />
        ) : null
      }
    >
      {brand.brandAliasVersion && (
        <Text type="secondary">Versión: {brand.brandAliasVersion}</Text>
      )}
      <Divider style={{ borderColor: '#d4c9a8' }} />
      {brand.muffinShapes.map((muffinShape, index) => (
        <MuffinShapeRow muffinShape={muffinShape} key={index} colorIndex={index} />
      ))}
    </StyledBrandCard>
  );
}

export default BrandRow;