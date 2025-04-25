import { Card, Button, Typography, Row, Col, Badge } from 'antd';
import ProductStockRow from '../product-stock-row/product-stock-row.component';
import { ProductContent } from '../../../models/stock/product-stock/product-stock-dto.model';
import './product-row.style.css';
import { useTranslation } from 'react-i18next';
import StockHistoryModal from '../movement-stock/movement-stock-history-modal.component';
import { useState } from 'react';

const { Title, Text } = Typography;

interface ProductRowProps {
  product: ProductContent;
}

export function ProductRow({ product }: ProductRowProps) {
  const totalStock = product.stockDetails.reduce((sum, item) => sum + item.stock, 0);
  const { t } = useTranslation();
  const [historicModalVisible, setHistoricModalVisible] = useState(false);

  const openHistoricModal = () => setHistoricModalVisible(true);
  const closeHistoricModal = () => setHistoricModalVisible(false);
  return (
    <Card
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
              onClick={() => openHistoricModal()}
              className="primary-button"
            >
              {t('stock.historic')}
            </Button>
          </div>
        </div>
      }
      className="product-card"
      extra={
        <Button type="primary" onClick={() => openHistoricModal()} className="primary-button pc-button">
          {t('stock.historic')}
        </Button>
      }
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6} lg={5} className="product-info">
          <Text className="product-box">
            {t('stock.boxLabel')}: {product.product.boxReference} - {product.product.boxDescription}
          </Text>

          <Text className="product-items">
            <br />
            {product.product.itemsPerProduct} {t('stock.boxUnit')}
          </Text>
          <br />
          <div className="stock-summary">
            {t('stock.totalStock')}:{' '}
            <Badge
              count={totalStock}
              showZero
              overflowCount={100000}
              style={{
                backgroundColor: totalStock > 0 ? '#52c41a' : '#f5222d',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            />{' '}
            {t('stock.unit')}
          </div>
        </Col>

        <Col xs={24} md={18} lg={19}>
          <Row gutter={[12, 12]}>
            {product.stockDetails.map((productStock) => (
              <Col xs={24} md={12} lg={8} xl={6} key={productStock.id}>
                <ProductStockRow productStock={productStock} productDescription={product.product.description} productReference={product.product.reference} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <StockHistoryModal
        visible={historicModalVisible}
        onClose={closeHistoricModal}
        productId={product.product.id}
        description={
          <>
            {product.product.reference}
            <br />
            {product.product.description}
          </>
        }
      />
    </Card>
  );
}

export default ProductRow;
