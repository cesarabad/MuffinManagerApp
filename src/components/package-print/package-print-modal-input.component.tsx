import { Modal, Table, Button } from 'antd';
import { useState, useEffect } from 'react';
import { packagePrintService } from '../../services/manage-data/package-print.service';
import { PackagePrintDto } from '../../models/package-print/package-print-dto.model';
import { useTranslation } from 'react-i18next';

interface PackagePrintModalInputProps {
  reference?: string;
  onChange: (value: number, reference: string) => void;
}

const PackagePrintModalInput = ({ reference, onChange }: PackagePrintModalInputProps) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [packagePrints, setPackagePrints] = useState<PackagePrintDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setLoading(true);
      packagePrintService.getAll()
        .then((response) => {
          setPackagePrints(response);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [visible]);

  const handleOpenModal = () => {
    setVisible(true);
  };

  const handleSelectPackagePrint = (record: PackagePrintDto) => {
    onChange(record.id ?? 0, record.reference ?? '');
    setVisible(false);
  };

  const columns = [
    {
      title: t('stock.packagePrintReferenceLabel'),
      dataIndex: 'reference',
      key: 'reference',
    },
    {
      title: t('stock.packagePrintDescriptionLabel'),
      dataIndex: 'description',
      key: 'description',
    },
  ];

  return (
    <>
      <Button onClick={handleOpenModal}>
        {reference || t('button.select')}
      </Button>

      <Modal
        title={t('stock.packagePrintLabel')}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          dataSource={packagePrints}
          columns={columns}
          rowKey="id"
          loading={loading}
          onRow={(record) => ({
            onClick: () => handleSelectPackagePrint(record),
          })}
          pagination={false}
        />
      </Modal>
    </>
  );
};

export default PackagePrintModalInput;
