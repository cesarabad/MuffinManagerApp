import { Card, Divider, Image, Typography } from 'antd';
import styled from 'styled-components';
import MuffinShapeRow from '../muffin-shape-row/muffin-shape-row.component';
import { BrandContent } from '../../../models/stock/product-stock/product-stock-dto.model';
import { motion } from 'framer-motion';
import { useDominantColor } from '../../../helpers/use-dominant-color';
import { getContrastColor, lightenDarkenColor } from '../../../helpers/color-utils';

const { Title, Text } = Typography;

const StyledBrandCard = styled(Card)<{ bgColor: string; headerBgColor: string; headerTextColor: string }>`
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  background-color: ${({ bgColor }) => bgColor};
  border: 2px solid #d4c9a8;
  width: 85%;
  margin: 0px auto 60px;
  &.brand-card {
    & > .ant-card-head {
      background-color: ${({ headerBgColor }) => headerBgColor};
      color: ${({ headerTextColor }) => headerTextColor};

      .ant-card-head-title {
        padding: 16px 0;

        h1.ant-typography {
          margin-bottom: 0;
          font-size: 28px;
          color: ${({ headerTextColor }) => headerTextColor};
          font-weight: 700;
          text-align: center;
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

    @media (max-width: 868px) {
      & > .ant-card-head {
        flex-direction: column;

        .ant-card-head-title {
          text-align: center;

          h1.ant-typography {
            font-size: 22px;
          }
        }
      }
    }

    @media (max-width: 868px) {
      width: 100%;
      & > .ant-card-head {
        .ant-card-head-title {
          h1.ant-typography {
            font-size: 20px; /* Further reduce font size for mobile */
          }
        }
      }
    }
  }
`;

const BrandTitleWrapper = styled.div<{ headerTextColor: string }>`
  text-align: center;
  width: 100%;

  h2.ant-typography {
    margin: 0;
    font-size: 28px;
    color: ${({ headerTextColor }) => headerTextColor};

    @media (max-width: 868px) {
      font-size: 20px;
    }
  }
`;

  

export function BrandRow({ brand }: { brand: BrandContent }) {
  const dominantColor = useDominantColor(brand.brandLogoBase64 ?? undefined) ?? '#fae292'; 

  const headerBgColor = lightenDarkenColor(dominantColor, -90);
  const headerTextColor = getContrastColor(headerBgColor);
  
  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      animate={{ opacity: 1, y: -70 }}
      transition={{ duration: 1 }}
    >
      <StyledBrandCard
        bgColor={dominantColor}
        headerBgColor={headerBgColor}
        headerTextColor={headerTextColor}
        title={
          <BrandTitleWrapper headerTextColor={headerTextColor}>
            <Title level={2} style={{ margin: 0 }}>{brand.brandName}</Title>
          </BrandTitleWrapper>
        }
        className="brand-card"
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
            <Text
              style={{
                fontSize: '20px', // Aumentar el tamaño de la fuente
                color: headerBgColor, // Usar el color del header
              }}
            >
              Versión: {brand.brandAliasVersion}
            </Text>
            <Divider
              style={{
                borderColor: headerBgColor, // El color del borde es el del header
                margin: '8px 0', // Para tener algo de espacio alrededor
              }}
            />
          </>
        )}
        {brand.muffinShapes.map((muffinShape, index) => (
          <MuffinShapeRow muffinShape={muffinShape} key={index} colorIndex={index} />
        ))}
      </StyledBrandCard>
    </motion.div>
  );
}

export default BrandRow;
