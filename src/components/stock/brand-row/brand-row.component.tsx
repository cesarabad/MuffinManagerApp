import { Card, Divider, Image, Typography } from 'antd';
import MuffinShapeRow from '../muffin-shape-row/muffin-shape-row.component';
import { BrandContent } from '../../../models/stock/product-stock/product-stock-dto.model';
import { motion } from 'framer-motion';
import { useDominantColor } from '../../../helpers/use-dominant-color';
import { getContrastColor, lightenDarkenColor } from '../../../helpers/color-utils';
import './brand-row.style.css';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

export function BrandRow({ brand }: { brand: BrandContent }) {
  const dominantColor = useDominantColor(brand.brandLogoBase64 ?? undefined) ?? '#fae292'; 
  const headerBgColor = lightenDarkenColor(dominantColor, -90);
  const headerTextColor = getContrastColor(headerBgColor);
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      animate={{ opacity: 1, y: -70 }}
      transition={{ duration: 1 }}
    >
      <Card
        className="brand-card"
        title={
          <div className="brand-title-wrapper">
            <Title level={2} style={{ margin: 0, color: headerTextColor }}>
              {brand.brandName}
            </Title>
          </div>
        }
        style={{
          backgroundColor: dominantColor,
          borderColor: '#d4c9a8',
          borderWidth: 2,
          borderStyle: 'solid',
        }}
        headStyle={{
          backgroundColor: headerBgColor,
          color: headerTextColor,
          borderBottom: `1px solid ${headerBgColor}`,
        }}
        extra={
          brand.brandLogoBase64 && brand.brandLogoBase64.length > 0 ? (
            <Image
              src={`data:image/png;base64,${brand.brandLogoBase64}`}
              alt={`${brand.brandName} logo`}
              preview={false}
              style={{ maxHeight: '45px' }}
            />
          ) : null
        }
      >
        {brand.brandAliasVersion && (
          <>
            <Text style={{ fontSize: '20px', color: headerBgColor }}>
              {t('stock.versionLabel')}: {brand.brandAliasVersion}
            </Text>
            <Divider style={{ borderColor: headerBgColor, margin: '8px 0' }} />
          </>
        )}
        {brand.muffinShapes.map((muffinShape, index) => (
          <MuffinShapeRow muffinShape={muffinShape} key={index} colorIndex={index} />
        ))}
      </Card>
    </motion.div>
  );
}

export default BrandRow;
