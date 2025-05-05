import { Col, Row, Typography, Button } from "antd";
import {
  faLayerGroup,
  faPuzzlePiece,
  faBox,
} from "@fortawesome/free-solid-svg-icons";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import PageContainer from "../../../../components/app/generic-page-container/PageContainer.component";
import ActionCard from "../../../../components/app/generic-action-card/ActionCard.component";
import { useAuth } from "../../../../contexts/auth/auth.context";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "../../../../models/routes";
import { Permission } from "../../../../models/index.model";

const { Title } = Typography;

const ManageProductDataPage = () => {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (key: string) => {
    switch (key) {
      case 'baseProductItems':
        navigate(`/private/${PrivateRoutes.MANAGE_BASE_PRODUCT_ITEM}`);
        break;
      case 'productItems':
        navigate(`/private/${PrivateRoutes.MANAGE_PRODUCT_ITEM}`);
        break;
      case 'products':
        navigate(`/private/${PrivateRoutes.MANAGE_PRODUCT}`);
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.MANAGE_DATA}`);
  };

  const options = [
    {
      key: 'products',
      title: t("manageData.productData.product.title"),
      description: t("manageData.productData.product.description"),
      icon: faBox,
      color: "#FFCC80",
    },
    {
      key: 'productItems',
      title: t("manageData.productData.productItem.title"),
      description: t("manageData.productData.productItem.description"),
      icon: faPuzzlePiece,
      color: "#A5D6A7",
    },
    {
      key: 'baseProductItems',
      title: t("manageData.productData.baseProductItem.title"),
      description: t("manageData.productData.baseProductItem.description"),
      icon: faLayerGroup,
      color: "#90CAF9",
    },
  ];

  return (
    <PageContainer>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={handleBack}
        style={{ marginBottom: 16 }}
        type="link"
      >
        {t("button.back")}
      </Button>

      <Title level={2} style={{ textAlign: "center", color: "#7A9AD2" }}>
        {t("manageData.productData.title")}
      </Title>

      <Row gutter={[16, 16]} justify="center">
        {options.map((opt) => (
          <Col xs={24} sm={12} md={8} key={opt.key}>
            <ActionCard
              icon={opt.icon}
              color={opt.color}
              title={opt.title}
              description={opt.description}
              onClick={() => handleSelect(opt.key)}
              disabled={!hasPermission(Permission.GetData) && !hasPermission(Permission.ManageData)}
            />
          </Col>
        ))}
      </Row>
    </PageContainer>
  );
};

export default ManageProductDataPage;
