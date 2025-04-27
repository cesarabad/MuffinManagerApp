import { Modal, Button, Input, Form, InputNumber, Row, Col, message } from 'antd';
import { MovementType } from '../../../../models/stock/movement-stock/reserve-dto.model';
import { movementStockService } from '../../../../services/stock/movement-stock.service';
import { useState, useEffect } from 'react';
import { FaArrowCircleRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

interface CreateReserveModalProps {
  productStockId: number;
  description: string;
  visible: boolean;
  onClose: () => void;
}

export function CreateReserveModal({ productStockId, description, visible, onClose }: CreateReserveModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const { t } = useTranslation();

  // Función para limpiar el formulario
  const clearForm = () => {
    form.resetFields();
  };

  useEffect(() => {
    const validateForm = async () => {
      try {
        await form.validateFields();
        setIsFormValid(true);
      } catch (error) {
        setIsFormValid(false);
      }
    };
    validateForm();
  }, [form]);

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const reserveData = {
        productStockId,
        type: MovementType.Reserve,
        units: values.units,
        destination: values.destination,
        observations: values.observations || null,
      };
      
      await movementStockService.insert(reserveData);
      message.success(t('stock.actions.reserves.successMessage'));
      clearForm(); // Limpiar formulario después de éxito
      onClose();
    } catch (error) {
      console.error('Error creating reserve:', error);
      message.error(t('stock.actions.reserves.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      title={t('stock.actions.reserves.addReserveTitle', { dato: description })}
      onCancel={() => {
        clearForm();
        onClose();
      }}
      footer={[<Button
          key="clear"
          onClick={clearForm}
          style={{
            backgroundColor: '#e0e0e0',
            borderColor: '#bdbdbd',
            fontWeight: 'bold',
            color: '#333',
            width: '130px',
            marginBottom: '10px'
          }}
        >
          {t('button.clean')}
        </Button>,<br/>,
        <Button
          key="cancel"
          onClick={() => {
            clearForm(); // Limpiar formulario cuando se cancela
            onClose();
          }}
          style={{
            backgroundColor: '#f4f5f7',
            borderColor: '#d9d9d9',
            fontWeight: 'bold',
            color: '#777',
            width: '130px',
          }}
        >
          {t('button.cancel')}
        </Button>,
        
        <Button
          key="create"
          type="primary"
          icon={<FaArrowCircleRight />}
          loading={loading}
          disabled={!isFormValid}
          onClick={handleCreate}
          style={{
            backgroundColor: '#3f51b5',
            borderColor: '#3f51b5',
            fontWeight: 'bold',
            color: 'white',
            width: '180px',
          }}
        >
          {t('stock.actions.reserves.createReserve')}
        </Button>,
      ]}
      centered
      width={500}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        style={{ padding: '0 24px' }}
      >
        <Row gutter={16}>
          

          <Col span={24}>
            <Form.Item
              label={<strong>{t('stock.actions.reserves.destinationLabel')}</strong>}
              name="destination"
              rules={[{ required: true, message: `${t('validation.required')}` }]}>
              <Input
                placeholder={t('stock.actions.reserves.destinationPlaceholder')}
                size="large"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={<strong>{t('stock.unitsLabel')}</strong>}
              name="units"
              rules={[{ required: true, message: `${t('validation.required')}` }]}>
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                placeholder={t('stock.unitsPlaceholder')}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={<strong>{t('stock.actions.reserves.observationsLabel')}</strong>}
              name="observations">
              <Input.TextArea
                placeholder={t('stock.actions.reserves.observationsPlaceholder')}
                rows={4}
                size="large"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default CreateReserveModal;
