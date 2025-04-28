import { useEffect, useState } from 'react';
import { productStockService } from '../../../services/stock/product-stock.service';
import { BrandContent } from '../../../models/stock/product-stock/product-stock-dto.model';
import BrandRow from '../../../components/stock/brand-row/brand-row.component';
import { Button, Dropdown, Layout, Menu, Modal, Space } from 'antd';
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
import { useAuth } from '../../../contexts/auth/auth.context';
import { Permission } from '../../../models/index.model';
import { checkStockService } from '../../../services/stock/check-stock.service';
import ProductStockCreateModal from '../../../components/stock/product-stock/create-product-stock-modal.component';

const { Header, Content } = Layout;

const StockPage = () => {
  const [brands, setBrands] = useState<BrandContent[]>();
  const [historicModalVisible, setHistoricModalVisible] = useState(false);
  const [forceCreateModalVisible, setForceCreateModalVisible] = useState(false);
  const [isWaitingForCreateFail, setIsWaitingForCreateFail] = useState(false);
  const [isCheckStockCompleted, setIsCheckStockCompleted] = useState(false);
  const [isCreateProductStockModalVisible, setIsCreateProductStockModalVisible] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

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
  };

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
      `/topic${checkStockService.getPath()}`,
    ],
    fetchData
  );

  // Solo nos suscribimos si estamos esperando fallo de creación
  useWebSocketListener(
    isWaitingForCreateFail ? ['/topic/createCheckStockFailed'] : [],
    () => {
      setForceCreateModalVisible(true);
      setIsWaitingForCreateFail(false); // Dejamos de esperar después de recibir
    }
  );

  useWebSocketListener('/topic/checkStockCompleted',  () => setIsCheckStockCompleted(true))

  const handleCreateCheckStock = async () => {
    setIsWaitingForCreateFail(true); // ACTIVAR LISTENER
    
    // Esperar un "tick" para asegurar que el listener esté montado
    setTimeout(async () => {
      await checkStockService.create();
      // Opcional: timeout de seguridad para dejar de escuchar después de unos segundos
      setTimeout(() => {
        setIsWaitingForCreateFail(false);
      }, 5000);
    }, 100); // 100 ms de delay para estar seguro
  };
  

  const checkStockMenu = (
    <Menu
      items={[
        {
          key: 'create',
          label: (
            <Button type="text" onClick={handleCreateCheckStock}>
              {t('button.initialize')}
            </Button>
          ),
        },
        {
          key: 'cancel',
          label: (
            <Button
              type="text"
              onClick={async () => await checkStockService.cancel()}
              disabled={!(brands && brands?.[0] && brands?.[0].hasToCheck)}
            >
              {t('button.finish')}
            </Button>
          ),
        },
      ]}
    />
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
              onClick={() => setIsCreateProductStockModalVisible(true)}
              className="primary-button"
              disabled={!hasPermission(Permission.ManageMovementStock) && !hasPermission(Permission.ManageStock)}
            >
              {t('stock.createProductStock')}
            </Button>
            <Dropdown menu={{ items: checkStockMenu.props.items }} trigger={['click']}>
              <Button
                className="secondary-button"
                disabled={!hasPermission(Permission.ManageStock)}
              >
                {t('stock.stockCount')}
              </Button>
            </Dropdown>
            <Button
              onClick={() => openHistoricModal()}
              className="secondary-button"
              disabled={!hasPermission(Permission.ManageMovementStock) && !hasPermission(Permission.ManageStock) && !hasPermission(Permission.GetStock)}
            >
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

      <Modal
        open={forceCreateModalVisible}
        onCancel={() => setForceCreateModalVisible(false)}
        onOk={async () => {
          await checkStockService.forceCreate();
          setForceCreateModalVisible(false);
          fetchData(); // Opcional: refrescar stock después
        }}
        okText={t('button.confirm')}
        cancelText={t('button.cancel')}
        title={t('stock.restartCheckStock')}
      >
        <p>{t('stock.askRestartCheckStock')}</p>
      </Modal>
      <Modal
        open={isCheckStockCompleted}
        onOk={() => setIsCheckStockCompleted(false)}
        cancelButtonProps={{ style: { display: 'none' } }}
        title={t('stock.checkStockCompleted')}
      >
        <p>{t('stock.checkStockCompletedMessage')}</p>
      </Modal>
      <ProductStockCreateModal
        visible={isCreateProductStockModalVisible}
        onClose={() => setIsCreateProductStockModalVisible(false)}
        stockRequired={false}/>
    </Layout>
  );
};

export default StockPage;
