import { Col, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { faCogs, faBoxOpen, faUsers } from '@fortawesome/free-solid-svg-icons';
import { PrivateRoutes } from '../../models/routes';
import ActionCard from '../../components/app/generic-action-card/ActionCard.component';
import PageContainer from '../../components/app/generic-page-container/PageContainer.component';
import { useAuth } from '../../contexts/auth/auth.context';
import { Permission } from '../../models/auth/permission.model';

const { Title } = Typography;

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  const handleCardClick = (action: string) => {
    switch (action) {
      case 'manageData':
        navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.MANAGE_DATA}`);
        break;
      case 'manageStock':
        navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.STOCK}`);
        break;
      case 'manageUsers':
        navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.MANAGE_USERS}`);
        break;
      default:
        break;
    }
  };

  return (
    <PageContainer>
      <Title level={2} style={{ textAlign: 'center', color: '#D27A7A' }}>
        {t('home.title')}
      </Title>

      <Row
        justify="center"
        gutter={[16, 16]}
        style={{ flexDirection: 'column', alignItems: 'center' }}
      >
        <Col span={24}>
          <ActionCard
            icon={faBoxOpen}
            color="#FFB74D"
            title={t('home.cards.stock.title')}
            description={t('home.cards.stock.description')}
            onClick={() => handleCardClick('manageStock')}
            disabled={!hasPermission(Permission.ManageStock) && !hasPermission(Permission.GetStock)}
          />
        </Col>

        <Col span={24}>
          <ActionCard
            icon={faCogs}
            color="#FF8A65"
            title={t('home.cards.data.title')}
            description={t('home.cards.data.description')}
            onClick={() => handleCardClick('manageData')}
            disabled={!(hasPermission(Permission.ManageData) || hasPermission(Permission.GetData))}
          />
        </Col>

        <Col span={24}>
          <ActionCard
            icon={faUsers}
            color="#4CAF50"
            title={t('home.cards.users.title')}
            description={t('home.cards.users.description')}
            onClick={() => handleCardClick('manageUsers')}
            disabled={!hasPermission(Permission.ManageUsers)}
          />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default HomePage;
