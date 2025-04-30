import React, { useState } from 'react';
import { Modal, Button, Input, Select, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { MovementType } from '../../../../models/stock/movement-stock/reserve-dto.model';
import { movementStockService } from '../../../../services/stock/movement-stock.service';
import './stock-movement-modal.style.css';

const { Text } = Typography;
const { Option } = Select;

interface StockMovementModalProps {
  visible: boolean;
  onClose: () => void;
  productStockId: number;
}

const StockMovementModal: React.FC<StockMovementModalProps> = ({
  visible,
  onClose,
  productStockId,
}) => {
  const { t } = useTranslation();
  const [type, setType] = useState<MovementType | undefined>();
  const [units, setUnits] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [observations, setObservations] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const resetForm = () => {
    setType(undefined);
    setUnits('');
    setDestination('');
    setObservations('');
  };

  const handleSubmit = async () => {
    if (!type || !units || !destination.trim()) {
      return;
    }

    const model = {
      productStockId,
      type,
      units: parseInt(units, 10),
      destination: destination.trim(),
      observations: observations.trim() || null,
    };

    try {
      setSubmitting(true);
      await movementStockService.insert(model);
      onClose();
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={t('stock.actions.movement.modalTitle')}
      open={visible}
      onCancel={() => {
        onClose();
        resetForm();
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            onClose();
            resetForm();
          }}
          icon={<i className="fas fa-arrow-left" />}
        >
          {t('button.back')}
        </Button>,
        <Button key="clear" onClick={resetForm} icon={<i className="fas fa-eraser" />}>
          {t('button.clean')}
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          disabled={!type || !units || !destination}
          loading={submitting}
        >
          <i className="fas fa-exchange-alt" /> {t('stock.performMovement')}
        </Button>,
      ]}
    >
      <div className="form-group">
        <Text strong>{t('stock.movementType')}</Text>
        <Select
          placeholder={t('stock.selectType')}
          value={type}
          onChange={setType}
          style={{ width: '100%' }}
        >
          <Option value={MovementType.Entry}>{t('stock.type.entry')}</Option>
          <Option value={MovementType.Assigned}>{t('stock.type.assigned')}</Option>
        </Select>
      </div>

      <div className="form-group">
        <Text strong>{t('stock.unitsLabel')}</Text>
        <Input
          type="number"
          value={units}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*$/.test(val)) setUnits(val);
          }}
          placeholder={t('stock.unitsPlaceholder')}
        />
      </div>

      <div className="form-group">
        <Text strong>{t('stock.destinationLabel')}</Text>
        <Input
          value={destination}
          onChange={(e) => {
            if (e.target.value.length <= 80) setDestination(e.target.value);
          }}
          placeholder={t('stock.destinationPlaceholder')}
        />
      </div>

      <div className="form-group">
        <Text strong>{t('stock.actions.adjustment.observationsLabel')}</Text>
        <Input.TextArea
          value={observations}
          onChange={(e) => {
            if (e.target.value.length <= 255) setObservations(e.target.value);
          }}
          placeholder={t('stock.actions.adjustment.observationsPlaceholder')}
          rows={2}
        />
      </div>
    </Modal>
  );
};

export default StockMovementModal;
