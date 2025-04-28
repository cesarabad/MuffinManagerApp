import { Modal, Table, Button } from 'antd';
import { useState, useEffect } from 'react';
import { productService } from '../../../services/manage-data/product-data/product.service';
import { ProductDto } from '../../../models/product-data/product/product-dto.model';
import { useTranslation } from 'react-i18next';

interface ProductModalInputProps {
  reference?: string;
  onChange: (value: number, reference: string) => void;
}

const ProductModalInput = ({ reference, onChange }: ProductModalInputProps) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  useEffect(() => {
    if (visible) {
      setLoading(true);
      productService.getAll()
        .then((response) => {
          setProducts(response);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [visible]);

  const handleOpenModal = () => {
    setVisible(true);
  };

  const handleSelectProduct = (record: ProductDto) => {
    onChange(record.id ?? 0, record.productItemInfo ?? '');
    setVisible(false);
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const columns = [
    {
      title: t('stock.productLabel'),
      dataIndex: 'productItemInfo',
      key: 'productItemInfo',
    },
    {
      title: t('stock.versionLabel'),
      dataIndex: 'aliasVersion',
      key: 'aliasVersion',
    }
  ];

  return (
    <>
      <Button onClick={handleOpenModal}>
        {reference || t('button.select')}
      </Button>

      <Modal
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width="100%"
        style={{ maxHeight: '100vh', overflow: 'hidden' }}
        wrapClassName="custom-modal"
        zIndex={1000}
      >
        <div style={{ height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
          <Table
            dataSource={products}
            columns={columns}
            rowKey="id"
            loading={loading}
            onRow={(record) => ({
              onClick: () => handleSelectProduct(record),
            })}
            pagination={pagination}
            onChange={handleTableChange}
          />
        </div>
      </Modal>
    </>
  );
};

export default ProductModalInput;
