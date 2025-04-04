import { Card, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const { Title, Paragraph } = Typography;

interface ActionCardProps {
  icon: any; // icono FontAwesome
  color?: string;
  title: string;
  description: string;
  onClick: () => void;
}

const ActionCard = ({ icon, color = '#FF8A65', title, description, onClick }: ActionCardProps) => {
  return (
    <Card
      hoverable
      onClick={onClick}
      style={{
        cursor: 'pointer',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%',
      }}
    >
      <FontAwesomeIcon icon={icon} size="3x" color={color} style={{ marginBottom: '12px' }} />
      <Title level={4} style={{ color }}>{title}</Title>
      <Paragraph style={{ fontSize: '16px', color: '#6F4F4F' }}>{description}</Paragraph>
    </Card>
  );
};

export default ActionCard;
