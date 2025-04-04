import { Col, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { faCogs, faBoxOpen, faUsers } from '@fortawesome/free-solid-svg-icons';
import { PrivateRoutes } from '../../models/routes';
import ActionCard from '../../components/app/generic-action-card/ActionCard.component';
import PageContainer from '../../components/app/generic-page-container/PageContainer.component';

const { Title } = Typography;

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCardClick = (action: string) => {
    switch (action) {
      case 'manageData':
        navigate(`/private/${PrivateRoutes.MANAGE_DATA}`);
        break;
      case 'manageStock':
        alert('Accediendo a gestionar el stock de magdalenas');
        break;
      case 'manageUsers':
        alert('Accediendo a gestionar los usuarios');
        break;
    }
  };

  return (
    <PageContainer>
      <Title level={2} style={{ textAlign: 'center', color: '#D27A7A' }}>
        {t('home.title')}
      </Title>

      <Row justify="center" gutter={[16, 16]} style={{ flexDirection: 'column', alignItems: 'center' }}>
        <Col span={24}>
          <ActionCard
            icon={faBoxOpen}
            color="#FFB74D"
            title={t('home.cards.stock.title')}
            description={t('home.cards.stock.description')}
            onClick={() => handleCardClick('manageStock')}
          />
        </Col>
        <Col span={24}>
          <ActionCard
            icon={faCogs}
            color="#FF8A65"
            title={t('home.cards.data.title')}
            description={t('home.cards.data.description')}
            onClick={() => handleCardClick('manageData')}
          />
        </Col>
        <Col span={24}>
          <ActionCard
            icon={faUsers}
            color="#4CAF50"
            title={t('home.cards.users.title')}
            description={t('home.cards.users.description')}
            onClick={() => handleCardClick('manageUsers')}
          />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default HomePage;
