import { Card, Button, Typography, Badge, Modal, Popover } from 'antd';
import { ProductStockResponseDto } from "../../../models/stock/product-stock/product-stock-dto.model";
import './product-stock-row.style.css';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import StockHistoryModal from '../movement-stock/movement-stock-history-modal.component';
import '@fortawesome/fontawesome-free/css/all.min.css';
import StockAdjustmentModal from '../movement-stock/adjustment-modal/adjustment-modal.component';
import { movementStockService } from '../../../services/stock/movement-stock.service';
import CreateReserveModal from '../movement-stock/reserve-modal/create-reserve-modal.component';
import { MovementType } from '../../../models/stock/movement-stock/reserve-dto.model';
import { useAuth } from '../../../contexts/auth/auth.context';
import { Permission } from '../../../models/index.model';
import { productStockService } from '../../../services/stock/product-stock.service';
import { toast } from 'react-toastify';
import ProductStockCreateModal from '../product-stock/create-product-stock-modal.component';

const { Text } = Typography;

interface ProductStockRowProps {
  productStock: ProductStockResponseDto;
  productReference?: string;
  productDescription?: string;
}

export function ProductStockRow({ productStock, productDescription, productReference }: ProductStockRowProps) {
  const stockBadgeClass = productStock.stock > 0 ? 'stock-badge' : 'stock-badge zero';
  const { t } = useTranslation();
  const [historicModalVisible, setHistoricModalVisible] = useState(false);
  const [labelModalVisible, setLabelModalVisible] = useState(false);
  const [labelContent, setLabelContent] = useState<{ reference: string; description: string } | null>(null);
  const [adjustModalVisible, setAdjustModalVisible] = useState(false);
  const [reservesModalVisible, setReservesModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmContent, setConfirmContent] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => {});
  const [editingReserveId, setEditingReserveId] = useState<number | null>(null);  
  const [editedReserve, setEditedReserve] = useState<any>(null);
  const [createReserveModalVisible, setCreateReserveModalVisible] = useState(false);
  const [checkStockModalVisible, setCheckStockModalVisible] = useState(false);
  const [isProductStockCreateModalVisible, setIsProductStockCreateModalVisible] = useState(false);

  const { hasPermission } = useAuth();

  const openHistoricModal = () => setHistoricModalVisible(true);
  const closeHistoricModal = () => setHistoricModalVisible(false);

  const openLabelModal = (reference: string, description: string) => {
    setLabelContent({ reference, description });
    setLabelModalVisible(true);
  };

  const closeLabelModal = () => {
    setLabelModalVisible(false);
    setLabelContent(null);
  };

  const openConfirmModal = (action: () => void, title: string, content: string) => {
    setOnConfirmAction(() => action);
    setConfirmTitle(title);
    setConfirmContent(content);
    setConfirmVisible(true);
  };
  const handleUndoMovement = async (movementStockId: number) => {
    try {
      await movementStockService.undoMovement(movementStockId);
    } catch (error) {
      console.error("Error undoing movement:", error);
    }
  };
  
  const handleEndReserve = async (movementStockId: number) => {
    try {
      await movementStockService.endReserve(movementStockId);
    } catch (error) {
      console.error("Error ending reserve:", error);
    }
  };
  return (
    <Card className="product-stock-card">
       <Button
        icon={<i className="fas fa-edit" />}
        onClick={() => setIsProductStockCreateModalVisible(true)}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          zIndex: 1,
          backgroundColor: 'rgba(100, 149, 237, 0.8)',
          border: '1.5px solid rgba(70, 130, 180, 1)',
          color: 'white',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(4px)',
        }}
        
        
      />
      <div>
        <div className="batch-header">
          <Text className="stock-batch">{productStock.batch}</Text>

          {productStock.packagePrint && (
            <Button
              className="print-button"
              onClick={() =>
                openLabelModal(
                  productStock.packagePrint.reference,
                  productStock.packagePrint.description
                )
              }
            >
              {productStock.packagePrint.reference}
            </Button>
          )}
          {productStock.hasToCheck == true && (
            <Button
              className="check-stock-button"
              onClick={() => setCheckStockModalVisible(true)}
            >
              {`${t('stock.actions.adjustment.checkStock')}`}
            </Button>
          
          )}
        </div>

        {productStock.observations && (
          <div className="stock-observations">{productStock.observations}</div>
        )}

        <div className="stock-value">
          {t('stock.label')}:{' '}
          <Badge
            count={productStock.stock == 0 ? '00' : productStock.stock}
            overflowCount={100000}
            className={stockBadgeClass}
          />{' '}
          {t('stock.unit')}
        </div>

      
        <div className="stock-reserves reserves-wrapper">
          <Button
            className="action-button reserves-button"
            onClick={() => setReservesModalVisible(true)}
            disabled={!hasPermission(Permission.ManageMovementStock) && !hasPermission(Permission.ManageStock)}
          >
            {t('stock.reserves')}
          </Button>

          <div>
            {productStock.reserves.map((reserve, index) => {
              const hasObservation = reserve.observations !== null && reserve.observations.trim() !== '';
              const badgeClass = hasObservation ? 'stock-reserve-badge with-observations' : 'stock-reserve-badge';

              const badgeContent = (
                <Badge
                  key={index}
                  count={`${reserve.destination}: ${reserve.units} ${t('stock.unit')}`}
                  className={badgeClass}
                />
              );

              return hasObservation ? (
                <Popover
                  key={index}
                  content={<div>{reserve.observations}</div>}
                  title={`${reserve.destination}: ${reserve.units} ${t('stock.unit')}`}
                >
                  {badgeContent}
                </Popover>
              ) : (
                badgeContent
              );
            })}
          </div>
        </div>
       

        <div className="stock-action-buttons">
          <Button
            className="action-button adjust-button"
            onClick={() => setAdjustModalVisible(true)}
            disabled={!hasPermission(Permission.ManageStock)}
          >
            {t('stock.adjust')}
          </Button>

          <Button
            className="action-button history-button"
            onClick={() => openHistoricModal()}
          >
            {t('stock.historic')}
          </Button>
        </div>
      </div>

      <StockHistoryModal
        visible={historicModalVisible}
        onClose={closeHistoricModal}
        productStockId={productStock.id}
        description={
          <>
            {productReference} - {productStock.batch}
            <br />
            {productDescription}
          </>
        }
      />

      <Modal
        title={t('stock.packagePrintLabel')}
        open={labelModalVisible}
        onCancel={closeLabelModal}
        footer={[
          <Button key="back" onClick={closeLabelModal} icon={<i className="fas fa-arrow-left" />}>
            {t('button.back')}
          </Button>
        ]}
      >
        {labelContent && (
          <div>
            <p>
              <strong>{t('stock.packagePrintReferenceLabel')}:</strong> {labelContent.reference}
            </p>
            <p>
              <strong>{t('stock.packagePrintDescriptionLabel')}:</strong> {labelContent.description}
            </p>
          </div>
        )}
      </Modal>

      <StockAdjustmentModal
        visible={adjustModalVisible}
        onClose={() => setAdjustModalVisible(false)}
        productStock={productStock}
        description={`${productReference} | ${productStock.batch} - ${productDescription}`}
      />
      <Modal
        open={confirmVisible}
        title={confirmTitle}
        onOk={() => {
          onConfirmAction();
          setConfirmVisible(false);
        }}
        onCancel={() => setConfirmVisible(false)}
        okText={t('button.confirm')}
        cancelText={t('button.cancel')}
      >
        <p>{confirmContent}</p>
      </Modal>
      <Modal
        open={reservesModalVisible}
        title={t('stock.actions.reserves.currentReserves')}
        onCancel={() => { setReservesModalVisible(false); setEditingReserveId(null); setEditedReserve(null); }}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => { setReservesModalVisible(false); setEditingReserveId(null); setEditedReserve(null); }}
            icon={<i className="fas fa-arrow-left" />}
          >
            {t('button.back')}
          </Button>
        ]}
        className="reserves-modal"
      >

        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            type="primary"
            icon={<i className="fas fa-plus" />}
            onClick={() => setCreateReserveModalVisible(true)}
            style={{
              backgroundColor: '#1976D2',
              borderColor: '#1976D2',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {t('stock.actions.reserves.addReserve')}
          </Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {productStock.reserves.map((reserve) => {
            const isEditing = editingReserveId === reserve.id;

            return (
              <Card
                key={reserve.id}
                style={{
                  backgroundColor: '#faf7ed',
                  borderColor: '#d4c9a8',
                  position: 'relative',
                  paddingTop: '24px'
                }}
              >
                
                {!isEditing && (
                  <Button
                    icon={<i className="fas fa-edit" />}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      border: 'none',
                      boxShadow: 'none'
                    }}
                    onClick={() => {
                      setEditingReserveId(reserve.id);
                      setEditedReserve({
                        destination: reserve.destination,
                        units: reserve.units,
                        observations: reserve.observations ?? ''
                      });
                    }}
                  />
                )}

                
                {isEditing ? (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div>
                        <strong>{t('stock.actions.reserves.destinationLabel')}:</strong><br />
                        <input
                          type="text"
                          value={editedReserve.destination}
                          onChange={(e) =>
                            setEditedReserve({ ...editedReserve, destination: e.target.value })
                          }
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div>
                        <strong>{t('stock.actions.reserves.unitsLabel')}:</strong><br />
                        <input
                          type="number"
                          value={editedReserve.units}
                          onChange={(e) =>
                            setEditedReserve({ ...editedReserve, units: Number(e.target.value) })
                          }
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div>
                        <strong>{t('stock.actions.reserves.observationsLabel')}:</strong><br />
                        <input
                          type="text"
                          value={editedReserve.observations}
                          onChange={(e) =>
                            setEditedReserve({ ...editedReserve, observations: e.target.value })
                          }
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <Button
                        type="primary"
                        icon={<i className="fas fa-save" />}
                        onClick={async () => {
                          
                          await movementStockService.update({
                            id: reserve.id,
                            type: MovementType.Reserve,
                            units: editedReserve.units,
                            destination: editedReserve.destination,
                            observations: editedReserve.observations
                          })
                          setEditingReserveId(null);
                          setEditedReserve(null);
                        }}
                      >
                        {t('button.confirm')}
                      </Button>

                      <Button
                        danger
                        icon={<i className="fas fa-times" />}
                        onClick={() => {
                          setEditingReserveId(null);
                          setEditedReserve(null);
                        }}
                      >
                        {t('button.cancel')}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p><strong>{t('stock.actions.reserves.destinationLabel')}:</strong> {reserve.destination}</p>
                    <p><strong>{t('stock.actions.reserves.unitsLabel')}:</strong> {reserve.units}</p>
                    <p><strong>{t('stock.actions.reserves.responsibleLabel')}:</strong> {reserve.responsible?.name}</p>
                    <p><strong>{t('stock.actions.reserves.creationDateLabel')}:</strong> {new Date(reserve.creationDate).toLocaleDateString()}</p>
                    {reserve.observations && (
                      <p><strong>{t('stock.actions.reserves.observationsLabel')}:</strong> {reserve.observations}</p>
                    )}

                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginTop: '8px',
                      justifyContent: 'flex-start'
                    }}>
                      <Button
                        danger
                        type="primary"
                        icon={<i className="fas fa-undo" />}
                        onClick={() => openConfirmModal(
                          () => handleUndoMovement(reserve.id),
                          t('stock.actions.undoMovement'),
                          t('stock.actions.askUndoMovement')
                        )}
                      >
                        {t('stock.actions.undoMovement')}
                      </Button>

                      <Button
                        type="primary"
                        icon={<i className="fas fa-check-circle" />}
                        onClick={() => openConfirmModal(
                          () => handleEndReserve(reserve.id),
                          t('stock.actions.endReserve'),
                          t('stock.actions.askEndReserve')
                        )}
                      >
                        {t('stock.actions.endReserve')}
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            );
          })}
        </div>
      </Modal>
      <CreateReserveModal
        visible={createReserveModalVisible}
        onClose={() => setCreateReserveModalVisible(false)}
        productStockId={productStock.id}
        description={`${productReference} | ${productStock.batch} - ${productDescription}`}
      />
      <Modal
        open={checkStockModalVisible}
        title={
          <>
        <strong>{t('stock.productLabel')}:</strong> {productReference}
        <br/>
        <strong>{t('stock.batchLabel')}:</strong> {productStock.batch}
        <br />
        {productDescription}
          </>
        }
        onCancel={() => setCheckStockModalVisible(false)}
        footer={[
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
        <Button
          key="back"
          onClick={() => setCheckStockModalVisible(false)}
        >
          {t('button.back')}
        </Button>
        <Button
          key="adjust"
          style={{ backgroundColor: '#faad14', color: 'white', borderColor: '#faad14' }}
          onClick={() => {setAdjustModalVisible(true); setCheckStockModalVisible(false);}}
        >
          {t('stock.adjust')}
        </Button>
        <Button
          key="confirm"
          type="primary"
          onClick={async () => {
            try {
              await productStockService.updateLastCheckDate(productStock.id);
              setCheckStockModalVisible(false);
              toast.success(t('stock.checkStockSuccess'));
            } catch (error) {
              console.error(error);
              toast.error("Error updating last check date");
            }
          }}
        >
          {t('button.confirm')}
        </Button>
          </div>
        ]}
      >
        <p style={{ textAlign: 'center', fontSize: '18px' }}>
          <strong>{t('stock.totalUnits')}:</strong><br />
          {productStock.stock + productStock.reserves.reduce((sum, reserve) => sum + reserve.units, 0)} {t('stock.unit')}
        </p>
      </Modal>
      <ProductStockCreateModal
        visible={isProductStockCreateModalVisible}
        onClose={() => setIsProductStockCreateModalVisible(false)}
        productStock={productStock}
        productId={1}
        productDescription={`${productReference} - ${productDescription}`}
        stockRequired={true}
      />
    </Card>
  );
}

export default ProductStockRow;
