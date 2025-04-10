import { Col, Row, Typography } from 'antd';
import {
  faBoxOpen,
  faCubes,
  faShapes,
  faPrint,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import PageContainer from '../../components/app/generic-page-container/PageContainer.component';
import ActionCard from '../../components/app/generic-action-card/ActionCard.component';
import { useAuth } from '../../contexts/auth/auth.context';
import { Permission } from '../../models/auth/permisos.model';
import { useNavigate } from 'react-router-dom';
import { PrivateRoutes } from '../../models/routes';

const { Title } = Typography;

const ManageDataPage = () => {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (key: string) => {
    switch (key) {
      case Permission.GetProducts:
        //navigate(`/${Permission.GetProducts}`);
        break;
      case Permission.GetBoxes:
        navigate(`/private/${PrivateRoutes.MANAGE_BOX}`);
        break;
      case Permission.GetMuffinShapes:
        navigate(`/private/${PrivateRoutes.MANAGE_MUFFIN_SHAPE}`);
        break;
      case Permission.GetPackagePrints:
        //navigate(`/${Permission.GetPackagePrints}`);
        break;
      default:
        break;
    }
  };

  const options = [
    {
      key: Permission.GetProducts,
      title: t('manageData.product.title'),
      description: t('manageData.product.description'),
      icon: faCubes,
      color: '#FF8A65',
    },
    {
      key: Permission.GetBoxes,
      title: t('manageData.box.title'),
      description: t('manageData.box.description'),
      icon: faBoxOpen,
      color: '#FFB74D',
    },
    {
      key: Permission.GetMuffinShapes,
      title: t('manageData.muffinShape.title'),
      description: t('manageData.muffinShape.description'),
      icon: faShapes,
      color: '#BA68C8',
    },
    {
      key: Permission.GetPackagePrints,
      title: t('manageData.packagePrint.title'),
      description: t('manageData.packagePrint.description'),
      icon: faPrint,
      color: '#4DD0E1',
    },
  ];

  return (
    <PageContainer>
      <Title level={2} style={{ textAlign: 'center', color: '#D27A7A' }}>
        {t('manageData.pageTitle')}
      </Title>

      <Row gutter={[16, 16]} justify="center">
        {options.map((opt) => (
          <Col xs={24} sm={12} md={8} lg={6} key={opt.key}>
            <ActionCard
              icon={opt.icon}
              color={opt.color}
              title={opt.title}
              description={opt.description}
              onClick={() => handleSelect(opt.key)}
              disabled={!hasPermission(opt.key)}
            />
          </Col>
        ))}
      </Row>
    </PageContainer>
  );
};

export default ManageDataPage;
