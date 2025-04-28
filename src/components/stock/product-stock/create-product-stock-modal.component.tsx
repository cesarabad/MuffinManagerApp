import { Modal, Button, Input, Form } from 'antd';
import { ProductStockRequestDto, ProductStockResponseDto } from '../../../models/stock/product-stock/product-stock-dto.model';
import { useState, useEffect } from 'react';
import { productStockService } from '../../../services/stock/product-stock.service';
import { useTranslation } from 'react-i18next';
import PackagePrintModalInput from '../../package-print/package-print-modal-input.component';
import ProductModalInput from '../../product-data/product/product-modal-input.component';

interface ProductStockCreateModalProps {
  visible: boolean;
  onClose: () => void;
  productStock?: ProductStockResponseDto;
  productId?: number;
  productDescription?: string;
  stockRequired: boolean;
}

const ProductStockCreateModal = ({ visible, onClose, productStock, productDescription, productId, stockRequired }: ProductStockCreateModalProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [packagePrintReference, setPackagePrintReference] = useState<string>(''); 
    const [productReference, setProductReference] = useState<string>('');
  useEffect(() => {
    if (visible) {
      if (productStock) {
        form.setFieldsValue({
          id: productStock.id,
          productId: productId,
          packagePrintId: productStock.packagePrint?.id,
          batch: productStock.batch,
          stock: productStock.stock,
          observations: productStock.observations || ''
        });
        if (productStock.packagePrint) {  
          setPackagePrintReference(productStock.packagePrint.reference || '');
        }
        if (productDescription) {
          setProductReference(`${productDescription}`);
        }
      } else {
        form.resetFields();
        setPackagePrintReference('');
        setProductReference('');
      }
    }
  }, [productStock, productId, visible, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      if (!stockRequired) {
        values.stock = 0;
      }

      const request: ProductStockRequestDto = {
        ...values,
        observations: values.observations?.trim() || null,
      };

      if (request.id) {
        await productStockService.update(request);
      } else {
        await productStockService.insert(request);
      }

      form.resetFields();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    const currentValues = form.getFieldsValue();
    form.resetFields();
    if (currentValues.id) {
      form.setFieldsValue({ id: currentValues.id });
    }
    setPackagePrintReference('');
    setProductReference('');
  };

  const handleCancel = () => {
    form.resetFields();
    setPackagePrintReference('');
    setProductReference('');
    onClose();
  };

  return (
    <Modal
      title={productStock?.id ? t('stock.editProductStock') : t('stock.createProductStock')}
      open={visible}
      zIndex={100}
      onCancel={handleCancel}
      footer={[
        <Button key="clear" onClick={handleClear}>
          {t('button.clean')}
        </Button>,
        <Button key="back" onClick={handleCancel}>
          {t('button.back')}
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          {productStock?.id ? t('button.update') : t('button.create')}
        </Button>
      ]}
    >
      <Form form={form} layout="vertical">
        {productStock?.id && (
          <Form.Item name="id" hidden={true}>
            <Input type="hidden" />
          </Form.Item>
        )}

        <Form.Item
          name="productId"
          label={t('stock.productLabel')}
          rules={[{ required: true, message: t('validation.required') }]} >
          <ProductModalInput
            reference={productReference}
            onChange={(value, reference) => {
              form.setFieldsValue({ productId: value });
              setProductReference(reference || '');
            }}
          />
        </Form.Item>

        <Form.Item
          name="packagePrintId"
          label={t('stock.packagePrintLabel')}
          rules={[{ required: false }]} >
          <PackagePrintModalInput
            reference={packagePrintReference}
            onChange={(value, reference) => {
              form.setFieldsValue({ packagePrintId: value });
              
              setPackagePrintReference(reference || '');
            }}
          />
        </Form.Item>

        <Form.Item
          name="batch"
          label={t('stock.batchLabel')}
          rules={[{ required: true, message: t('validation.required') }]} >
          <Input />
        </Form.Item>

        {stockRequired && (
          <Form.Item
            name="stock"
            label={t('stock.boxesLabel')}
            rules={[{ required: true, message: t('validation.required') }]} >
            <Input type="number" />
          </Form.Item>
        )}

        <Form.Item
          name="observations"
          label={t('stock.observationsLabel')} >
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductStockCreateModal;
