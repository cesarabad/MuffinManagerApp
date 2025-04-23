import { Card, Divider, Typography } from 'antd';
import styled from 'styled-components';
import ProductRow from '../product-row/product-row.component';
import { MuffinShapeContent } from '../../../models/stock/product-stock/product-stock-dto.model';
import { getContrastColor } from '../../../helpers/color-utils';


const { Title } = Typography;

const MUFFIN_SHAPE_COLORS = [
  {
    bg: '#eef3f8',
    border: '#b2c6db',
    header: '#4b6b8a',
  },
  {
    bg: '#f2f2f7',
    border: '#c3c3dc',
    header: '#6e6e9c',
  },
  {
    bg: '#e8f1ec',
    border: '#b1d0be',
    header: '#4b8b6d',
  },
  {
    bg: '#e4f3f5',
    border: '#a8d6dd',
    header: '#3a7f8c',
  },
  {
    bg: '#f9f6f0',
    border: '#ddd1c0',
    header: '#8a7960',
  },
];




// Aseguramos de que MuffinShapeRowWrapper reciba $colorScheme como propiedad
const MuffinShapeRowWrapper = styled.div<{ $colorScheme: typeof MUFFIN_SHAPE_COLORS[0] }>`
  .muffin-shape-card {
    margin-bottom: 16px;
    border-radius: 8px;
    background-color: ${props => props.$colorScheme.bg};
    border: 2px solid ${props => props.$colorScheme.border};
    width: 90%;
    margin: 10px auto 30px;
  }

  .muffin-shape-card .ant-card-head {
    background-color: ${props => props.$colorScheme.header};
    border-radius: 6px 6px 0 0;
    border-bottom: 2px solid ${props => props.$colorScheme.border};
  }

  .muffin-shape-card .ant-card-head .ant-card-head-title {
    padding: 12px 0;
  }

  .muffin-shape-card .ant-card-head .ant-card-head-title h2.ant-typography {
    margin-bottom: 0;
    font-size: 22px;
    color: white;
    font-weight: 600;
  }

  .muffin-shape-card .ant-card-body {
    padding: 16px;
  }

  @media (max-width: 868px) {
    .muffin-shape-card .ant-card-head .ant-card-head-title h2.ant-typography {
      font-size: 18px;
    }
    .muffin-shape-card {
      width: 100%;
  }
}
`;

const StyledMuffinCard = styled(Card)<{ $colorScheme: typeof MUFFIN_SHAPE_COLORS[0] }>`
  margin-bottom: 16px;
  border-radius: 8px;
  background-color: ${props => props.$colorScheme.bg};
  border: 2px solid ${props => props.$colorScheme.border};

  & .ant-card-head {
    background-color: ${props => props.$colorScheme.header};
    border-radius: 6px 6px 0 0;
    border-bottom: 2px solid ${props => props.$colorScheme.border};
  }

  & .ant-card-head-title {
    padding: 12px 0;

    & h2.ant-typography {
      margin-bottom: 0;
      font-size: 22px;
      color: white;
      font-weight: 600;
    }
  }

  & .ant-card-body {
    padding: 16px;
    width: 100%;
  }

  @media (max-width: 868px) {
    & .ant-card-head-title {
      & h2.ant-typography {
        font-size: 18px;
      }
    }
  }
`;

const MuffinShapeTitleWrapper = styled.div`
  text-align: center;
  width: 100%;

  h2.ant-typography {
    margin: 0;
    font-size: 22px;
    color: white;
    font-weight: 600;

    @media (max-width: 868px) {
      font-size: 18px;
    }
  }
`;


export function MuffinShapeRow({
  muffinShape,
  colorIndex = 0
}: {
  muffinShape: MuffinShapeContent;
  colorIndex: number;
}) {
  const colorScheme = MUFFIN_SHAPE_COLORS[colorIndex % MUFFIN_SHAPE_COLORS.length];
  const contrastTextColor = getContrastColor(colorScheme.header);

  return (
    <MuffinShapeRowWrapper $colorScheme={colorScheme}>
      <StyledMuffinCard
        title={
          <MuffinShapeTitleWrapper>
            <Title level={3} style={{ color: contrastTextColor }}>{muffinShape.muffinShape}</Title>
          </MuffinShapeTitleWrapper>
        }
        
        className="muffin-shape-card"
        $colorScheme={colorScheme}
      >
        {muffinShape.products.map((product, index) => (
            <>
            <ProductRow product={product} key={index} />
            {index !== muffinShape.products.length - 1 && (
              <Divider
              style={{
                borderColor: colorScheme.header,
                borderWidth: 2,
                borderRadius: 4,
              }}
              />
            )}
            </>
        ))}
      </StyledMuffinCard>
    </MuffinShapeRowWrapper>
  );
}

export default MuffinShapeRow;
