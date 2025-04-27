import { useEffect, useState } from 'react';
import { productStockService } from '../../../services/stock/product-stock.service';
import { BrandContent } from '../../../models/stock/product-stock/product-stock-dto.model';
import BrandRow from '../../../components/stock/brand-row/brand-row.component';
import { Button, Layout, Space } from 'antd';
import './stock-page.style.css';
import StockHistoryModal from '../../../components/stock/movement-stock/movement-stock-history-modal.component';
import { useTranslation } from 'react-i18next';
import { useWebSocketListener } from '../../../services/web-socket-listenner.service';
import { movementStockService } from '../../../services/stock/movement-stock.service';
import { packagePrintService } from '../../../services/manage-data/package-print.service';
import { muffinShapeService } from '../../../services/manage-data/muffin-shape.service';
import { boxService } from '../../../services/manage-data/box.service';
import { brandService } from '../../../services/manage-data/brand.service';
import { baseProductItemService } from '../../../services/manage-data/product-data/base-product-item.service';
import { productItemService } from '../../../services/manage-data/product-data/product-item.service';
import { productService } from '../../../services/manage-data/product-data/product.service';
import { useNavigate } from 'react-router-dom';
import { PrivateRoutes } from '../../../models/routes';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;

const StockPage = () => {
  const [brands, setBrands] = useState<BrandContent[]>();
  const { t } = useTranslation();
  const [historicModalVisible, setHistoricModalVisible] = useState(false);
  const navigate = useNavigate();
  const openHistoricModal = () => setHistoricModalVisible(true);
  const closeHistoricModal = () => setHistoricModalVisible(false);

  const fetchData = async () => {
    try {
      const data = await productStockService.getGroupedBy();
      setBrands([...data]);

    } catch (error) {
      console.error('Error fetching product stock:', error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const handleBack = () => {
    navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.HOME}`);
  }

  useWebSocketListener(
  [
    `/topic${movementStockService.getPath()}`,
    `/topic${packagePrintService.getPath()}`,
    `/topic${productStockService.getPath()}`,
    `/topic${muffinShapeService.getPath()}`,
    `/topic${boxService.getPath()}`,
    `/topic${brandService.getPath()}`,
    `/topic${baseProductItemService.getPath()}`,
    `/topic${productItemService.getPath()}`,
    `/topic${productService.getPath()}`,
  ],
  fetchData
);
  return (
    <Layout className="stock-layout">
      <Header className="stock-header">
        <Space wrap size="large" className="header-space">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="secondary-button"
            style={{ marginRight: 50, width: "auto" }}
            >
            {t("button.back")}
            </Button>
            <Space size="small">
            <Button
              type="primary"
              onClick={() => alert('Realizar movimiento')}
              className="primary-button"
            >
              {t('stock.realizeMovement')}
            </Button>
            <Button onClick={() => alert('Hacer recuento')} className="secondary-button">
              {t('stock.stockCount')}
            </Button>
            <Button onClick={() => openHistoricModal()} className="secondary-button">
              {t('stock.historic')}
            </Button>
            </Space>
        </Space>
      </Header>
      <Content className="stock-content">
        {brands?.map((brand, index) => (
          <BrandRow brand={brand} key={index} />
        ))}
      </Content>
      <StockHistoryModal
        visible={historicModalVisible}
        onClose={closeHistoricModal}
      />
    </Layout>
  );
};

export default StockPage;
