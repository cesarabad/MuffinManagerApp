import { Card, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const { Title, Paragraph } = Typography;

interface ActionCardProps {
  icon: any;
  color?: string;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}

const ActionCard = ({
  icon,
  color = '#FF8A65',
  title,
  description,
  onClick,
  disabled = false,
}: ActionCardProps) => {
  return (
    <Card
      hoverable={!disabled}
      onClick={() => {
        if (!disabled) onClick();
      }}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%',
        transition: 'opacity 0.3s ease',
      }}
    >
      <FontAwesomeIcon
        icon={icon}
        size="3x"
        color={color}
        style={{ marginBottom: '12px' }}
      />
      <Title level={4} style={{ color }}>{title}</Title>
      <Paragraph style={{ fontSize: '16px', color: '#6F4F4F' }}>{description}</Paragraph>
    </Card>
  );
};

export default ActionCard;
