import styled from 'styled-components';
import { Card, Modal, Avatar } from 'antd';

export const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
  
  .ant-modal-header {
    border-radius: 12px 12px 0 0;
    padding: 20px 24px;
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
    border-bottom: none;
  }
  
  .ant-modal-title {
    color: white;
    font-weight: 600;
    font-size: 18px;
  }
  
  .ant-modal-body {
    padding: 24px;
  }
  
  .ant-tabs-nav {
    margin-bottom: 20px;
  }
  
  .ant-form-item-label > label {
    font-weight: 500;
    color: #222;
  }
`;

export const PermissionCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    padding: 12px 16px;
  }
`;

export const UserInfoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 10px;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const UserAvatar = styled(Avatar)`
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  font-size: 24px;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  
  @media (max-width: 576px) {
    margin-bottom: 12px;
  }
`;

export const TagGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;