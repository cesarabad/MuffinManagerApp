import { Modal, Table, Button, Input, Space } from 'antd';
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
  const [filteredProducts, setFilteredProducts] = useState<ProductDto[]>([]);
  const [searchRef, setSearchRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  useEffect(() => {
    if (visible) {
      setLoading(true);
      productService.getAll()
        .then((response) => {
          setProducts(response);
          setFilteredProducts(response);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [visible]);

  const handleOpenModal = () => {
    setVisible(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setVisible(false);
    document.body.style.overflow = '';
  };

  const handleSelectProduct = (record: ProductDto) => {
    onChange(record.id ?? 0, record.productItemInfo ?? '');
    handleCloseModal();
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const handleSearch = (value: string) => {
    setSearchRef(value);
    const filtered = products.filter((product) =>
      product.productItemInfo?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
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
        onCancel={handleCloseModal}
        footer={null}
        width="100vw"
        style={{ top: 0, height: '80vh', padding: 0 }}
        bodyStyle={{ height: '80vh', padding: 0, overflow: 'hidden' }}
        wrapClassName="custom-modal"
        zIndex={1000}
      >
        <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
            <Input
              placeholder={t('stock.search')}
              value={searchRef}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Space>

          <div style={{ flex: 1, overflow: 'auto' }}>
            <Table
              dataSource={filteredProducts}
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
        </div>
      </Modal>
    </>
  );
};

export default ProductModalInput;