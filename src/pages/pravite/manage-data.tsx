import { Col, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { faBoxOpen, faCubes, faShapes, faPrint } from '@fortawesome/free-solid-svg-icons';
import ActionCard from '../../components/app/generic-action-card/ActionCard.component';
import PageContainer from '../../components/app/generic-page-container/PageContainer.component';
import Paragraph from 'antd/es/typography/Paragraph';

const { Title } = Typography;

const ManageDataPage = () => {
  const { t } = useTranslation();

  const options = [
    {
      key: 'product',
      icon: faCubes,
      color: '#FF8A65',
      title: t('manageData.product.title'),
      description: t('manageData.product.description'),
    },
    {
      key: 'box',
      icon: faBoxOpen,
      color: '#FFB74D',
      title: t('manageData.box.title'),
      description: t('manageData.box.description'),
    },
    {
      key: 'muffinShape',
      icon: faShapes,
      color: '#BA68C8',
      title: t('manageData.muffinShape.title'),
      description: t('manageData.muffinShape.description'),
    },
    {
      key: 'packagePrint',
      icon: faPrint,
      color: '#64B5F6',
      title: t('manageData.packagePrint.title'),
      description: t('manageData.packagePrint.description'),
    },
  ];

  const handleSelect = (key: string) => {
    alert(`Seleccionado: ${key}`);
  };

  return (
    <PageContainer>
      <Title level={2} style={{ textAlign: 'center', color: '#D27A7A' }}>
        {t('manageData.pageTitle')}
      </Title>

      <Paragraph style={{ textAlign: 'center', marginBottom: '40px', color: '#8D6E63' }}>
        {t('manageData.pageDescription')}
      </Paragraph>

      <Row gutter={[16, 16]} justify="center">
        {options.map((opt) => (
          <Col key={opt.key} xs={24} sm={12} md={8} lg={6}>
            <ActionCard
              icon={opt.icon}
              color={opt.color}
              title={opt.title}
              description={opt.description}
              onClick={() => handleSelect(opt.key)}
            />
          </Col>
        ))}
      </Row>
    </PageContainer>
  );
};

export default ManageDataPage;
