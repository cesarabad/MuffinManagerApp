import { useEffect, useState } from 'react';
import { productStockService } from '../../../services/stock/product-stock.service';
import { StockResponse } from '../../../models/stock/product-stock/product-stock-dto.model';
import BrandRow from '../../../components/stock/brand-row/brand-row.component';
import { Button, Layout, message, Space } from 'antd';
import './stock-page.style.css';
import StockHistoryModal from '../../../components/stock/movement-stock/movement-stock-history-modal.component';
import { useTranslation } from 'react-i18next';

const { Header, Content } = Layout;

const StockPage = () => {
  const [brands, setBrands] = useState<StockResponse>();
  const { t } = useTranslation();
  const [historicModalVisible, setHistoricModalVisible] = useState(false);

  const openHistoricModal = () => setHistoricModalVisible(true);
  const closeHistoricModal = () => setHistoricModalVisible(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await productStockService.getGroupedBy();
        setBrands(data);
      } catch (error) {
        console.error('Error fetching product stock:', error);
      }
    };

    fetchData();
  }, []);

  const showAlert = (msg: string) => message.info(msg);

  return (
    <Layout className="stock-layout">
      <Header className="stock-header">
        <Space wrap size="large" className="header-space">
          <Space size="middle">
            <Button
              type="primary"
              onClick={() => showAlert('Realizar movimiento')}
              className="primary-button"
            >
              {t('stock.realizeMovement')}
            </Button>
            <Button onClick={() => showAlert('Hacer recuento')} className="secondary-button">
              {t('stock.stockCount')}
            </Button>
            <Button onClick={() => showAlert('Consultar reservas')} className="secondary-button">
              {t('stock.checkReserves')}
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
