import React, { useState, useMemo } from 'react';
import { Modal, Button, Input, Popover, Typography, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { MovementType } from '../../../../models/stock/movement-stock/reserve-dto.model';
import { movementStockService } from '../../../../services/stock/movement-stock.service';
import { ProductStockResponseDto } from '../../../../models/stock/product-stock/product-stock-dto.model';
import { MovementStock } from '../../../../models/stock/movement-stock/reserve-dto.model';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './adjustment-modal.style.css';

const { Text } = Typography;

interface StockAdjustmentModalProps {
  visible: boolean;
  onClose: () => void;
  productStock: ProductStockResponseDto;
  description?: string;
}

const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  visible,
  onClose,
  productStock,
  description,
}) => {
  const { t } = useTranslation();
  const [units, setUnits] = useState<string>('');
  const [observation, setObservation] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const totalUnits = useMemo(() => {
    return productStock.stock + productStock.reserves.reduce((acc, r) => acc + r.units, 0);
  }, [productStock]);

  const handleAdjust = async () => {
    const movement: MovementStock = {
      productStockId: productStock.id,
      type: MovementType.Adjustment,
      units: parseInt(units, 10) - productStock.reserves.reduce((acc, r) => acc + r.units, 0),
      observations: observation
    };

    try {
      setSubmitting(true);
      await movementStockService.insert(movement);
      message.success(t('stock.adjustmentSuccess'));
      onClose();
    } catch (error) {
      message.error(t('stock.adjustmentError'));
    } finally {
      setSubmitting(false);
    }
  };

  const renderReserveBadge = (reserve: any, index: number) => {
    const badgeContent = `${reserve.destination} - ${reserve.units} ${t('stock.unit')}`;
    const badgeClass = reserve.observations
      ? 'stock-reserve-badge-custom highlighted'
      : 'stock-reserve-badge-custom disabled-look';
  
    if (reserve.observations) {
      return (
        <Popover
          key={index}
          content={reserve.observations}
          title={t('stock.actions.adjustment.observationsLabel')}
          trigger="click"
        >
          <div className={badgeClass}>{badgeContent}</div>
        </Popover>
      );
    }
  
    return <div key={index} className={badgeClass}>{badgeContent}</div>;
  };
  

  return (
    <Modal
      title={t('stock.actions.adjustment.modalTitle')}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose} icon={<i className="fas fa-arrow-left" />}>
          {t('button.back')}
        </Button>,
        <Button
          key="adjust"
          type="primary"
          onClick={handleAdjust}
          disabled={!units}
          loading={submitting}
        >
          <i className="fas fa-tools" /> {t('stock.adjust')}
        </Button>,
      ]}
    >
      {description && <Text strong>{description}</Text>}

      <div className="reserves-section-custom">
        <Text strong>{t('stock.actions.adjustment.currentReserves')}</Text>
        <div className="reserves-wrapper-custom">
            {productStock.reserves.map(renderReserveBadge)}
        </div>
      </div>

      <div className="total-units-summary-custom">
        <div className="total-info">
            <div className="stock-info">
            <Text className="stock-label">{t('stock.label')}: </Text>
            <Text className="stock-value-custom">{productStock.stock} {t('stock.unit')}</Text>
            </div>
            <div className="reserve-info">
            <Text className="reserve-label">{t('stock.actions.adjustment.currentReserves')}: </Text>
            <Text className="reserve-value-custom">
                {productStock.reserves.reduce((acc, reserve) => acc + reserve.units, 0)} {t('stock.unit')}
            </Text>
            </div>
            <div className="total-info">
            <Text className="total-label">{t('stock.totalUnits')}:</Text>
            <Text className="total-value-custom">{totalUnits} {t('stock.unit')}</Text>
            </div>
        </div>
    </div>


      <div className="important-note-custom yellow">
        <i className="fas fa-exclamation-triangle yellow-icon" />
        <Text className="yellow-text">{t('stock.actions.adjustment.importantModalNote')}</Text>
      </div>

      <div className="form-group">
        <Text strong>{t('stock.actions.adjustment.unitsLabel')}</Text>
        <Input
            type="number"
            value={units}
            onChange={(e) => {
            const val = e.target.value;
            if (/^\d*$/.test(val)) setUnits(val);
            }}
            placeholder={t('stock.actions.adjustment.unitsPlaceholder')}
        />
      </div>

      <div className="form-group">
        <Text strong>{t('stock.actions.adjustment.observationsLabel')}</Text>
        <Input.TextArea
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder={t('stock.actions.adjustment.observationsPlaceholder')}
            rows={2}
        />
      </div>
    </Modal>
  );
};

export default StockAdjustmentModal;
