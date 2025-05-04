// BackButton.tsx
import React from "react";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { PrivateRoutes } from "../../../../models/routes";

const ButtonHighlight = styled(Button)`
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
  }
`;

interface BackButtonProps {
  t: (key: string) => string;
}

const BackButton: React.FC<BackButtonProps> = ({ t }) => {
  const navigate = useNavigate();

  return (
    <ButtonHighlight 
      icon={<ArrowLeftOutlined />} 
      onClick={() => navigate(PrivateRoutes.MANAGE_USERS)}
      style={{ marginBottom: 16 }}
      size="large"
    >
      {t("profile.backToUsers")}
    </ButtonHighlight>
  );
};

export default BackButton;