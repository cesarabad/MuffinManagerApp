import { Card, Divider, Typography } from 'antd';
import ProductRow from '../product-row/product-row.component';
import { MuffinShapeContent } from '../../../models/stock/product-stock/product-stock-dto.model';
import { getContrastColor } from '../../../helpers/color-utils';
import './muffin-shape-row.style.css';

const { Title } = Typography;

const MUFFIN_SHAPE_COLORS = [
  { bg: '#eef3f8', border: '#b2c6db', header: '#4b6b8a' },
  { bg: '#f2f2f7', border: '#c3c3dc', header: '#6e6e9c' },
  { bg: '#e8f1ec', border: '#b1d0be', header: '#4b8b6d' },
  { bg: '#e4f3f5', border: '#a8d6dd', header: '#3a7f8c' },
  { bg: '#edf7f1', border: '#b8d9c7', header: '#2f7354' },
  { bg: '#f9f6f0', border: '#ddd1c0', header: '#8a7960' },
];

export function MuffinShapeRow({
  muffinShape,
  colorIndex = 0,
}: {
  muffinShape: MuffinShapeContent;
  colorIndex: number;
}) {
  const colorScheme = MUFFIN_SHAPE_COLORS[colorIndex % MUFFIN_SHAPE_COLORS.length];
  const contrastTextColor = getContrastColor(colorScheme.header);

  return (
    <Card
      title={
        <div className="muffin-shape-title-wrapper">
          <Title level={3} style={{ color: contrastTextColor }}>{muffinShape.muffinShape}</Title>
        </div>
      }
      className="muffin-shape-card"
      style={{
        backgroundColor: colorScheme.bg,
        borderColor: colorScheme.border,
        borderWidth: 2,
        borderStyle: 'solid',
      }}
      headStyle={{
        backgroundColor: colorScheme.header,
        borderColor: colorScheme.border,
        borderBottom: `2px solid ${colorScheme.border}`,
        borderRadius: '6px 6px 0 0',
      }}
    >
      {muffinShape.products.map((product, index) => (
        <div key={index}>
          <ProductRow product={product} />
          {index !== muffinShape.products.length - 1 && (
            <Divider
              style={{
                borderColor: colorScheme.header,
                borderWidth: 2,
                borderRadius: 4,
              }}
            />
          )}
        </div>
      ))}
    </Card>
  );
}

export default MuffinShapeRow;
