import { useTranslation } from "react-i18next";
import { CrudManagerPage } from "../../../../../components/app/generic-crud-manager-page/generic-crud-manager-page.component";
import { GenericInput } from "../../../../../components/app/generic-form/generic-input.component";
import { BaseProductItemDto } from "../../../../../models/product-data/base-product-item/base-product-item-dto.model";
import { baseProductItemService } from "../../../../../services/manage-data/product-data/base-product-item.service"; 
import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "../../../../../models/routes";
import { GenericSelect } from "../../../../../components/app/generic-form/generic-select.component";
import { muffinShapeService } from "../../../../../services/manage-data/muffin-shape.service";
import { MuffinShapeDto } from "../../../../../models/muffin-shape/muffin-shape-dto.model";
import { useEffect, useState } from "react";
import { useWebSocketListener } from "../../../../../services/web-socket-listenner.service";

export default function BaseProductItemPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [muffinShapeList, setMuffinShapeList] = useState<MuffinShapeDto[]>([]);

useEffect(() => {
    fetchMuffinShapes();
}, []);
  
  const fetchMuffinShapes = async () => {
    try {
      setMuffinShapeList(await muffinShapeService.getAll());
    } catch (error) {
      console.error("Error fetching muffin shapes:", error);
    }
  }
  const handleWsMessage = async () => {
      await fetchMuffinShapes();
    };
  
    useWebSocketListener(`/topic${muffinShapeService.getPath()}`, handleWsMessage);
  return (
    <CrudManagerPage<BaseProductItemDto>
      title={t('manageData.productData.baseProductItem.page.title')}
      service={baseProductItemService}
      handleBack={() => navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.MANAGE_PRODUCTS_DATA}`)}
      createEmptyItem={() => ({ reference: "", mainDescription: "" })}
      extraColumns={[
        { title: t('manageData.productData.baseProductItem.page.reference.label'), dataIndex: "reference", key: "reference" },
        { 
            title: t('manageData.productData.baseProductItem.page.muffinShape.label'), 
            dataIndex: "muffinShape", 
            key: "muffinShape",
            render: (_: unknown, record: BaseProductItemDto) => muffinShapeList.find((shape) => shape.id === record.muffinShape)?.description || ""
        },
        { title: t('manageData.productData.baseProductItem.page.mainDescription.label'), dataIndex: "mainDescription", key: "mainDescription" },        
        { title: t('manageData.productData.baseProductItem.page.unitsPerItem.label'), dataIndex: "unitsPerItem", key: "unitsPerItem" },
        { title: t('manageData.productData.baseProductItem.page.weight.label'), dataIndex: "weight", key: "weight" },
        { title: t('manageData.lastModifyDate'), dataIndex: "lastModifyDate", key: "lastModifyDate" },
        { 
          title: t('manageData.lastModifyUser'), 
          dataIndex: ["lastModifyUser", "id"],  
          key: "lastModifyUser",
          render: (_: unknown, record: BaseProductItemDto) => `${record.lastModifyUser?.name || ""} ${record.lastModifyUser?.secondName || ""}`.trim()
        },
      ]}
      renderExtraFields={(item, handleChange) => (
        <>
          <GenericInput
            label={t('manageData.productData.baseProductItem.page.reference.label')}
            placeholder={t('manageData.productData.baseProductItem.page.reference.placeholder')}
            value={item?.reference || ""}
            onChange={(e) => handleChange("reference", e.target.value)}
            required={true}
            maxLength={20}
          />
          <GenericSelect<MuffinShapeDto>
            label={t('manageData.productData.baseProductItem.page.muffinShape.label')}
            data={muffinShapeList}
            value = {muffinShapeList.find((shape) => shape.id === item.muffinShape)?.description}
            valueField="id"
            labelField="description"
            onChange={(value) => handleChange("muffinShape", value)}
          />
          <GenericInput
            label={t('manageData.productData.baseProductItem.page.mainDescription.label')}
            placeholder={t('manageData.productData.baseProductItem.page.mainDescription.placeholder')}
            value={item.mainDescription || ""}
            onChange={(e) => handleChange("mainDescription", e.target.value)}
            maxLength={80}
          />
          <GenericInput
            label={t('manageData.productData.baseProductItem.page.unitsPerItem.label')}
            placeholder={t('manageData.productData.baseProductItem.page.unitsPerItem.placeholder')}
            value={item.unitsPerItem || ""}
            onChange={(e) => handleChange("unitsPerItem", e.target.value)}
            type="number"
            inputMode="numeric"
          />
          <GenericInput
            label={t('manageData.productData.baseProductItem.page.weight.label')}
            placeholder={t('manageData.productData.baseProductItem.page.weight.placeholder')}
            value={item.weight || ""}
            onChange={(e) => handleChange("weight", e.target.value)}
            type="number"
          />
        </>
      )}
    />
  );
}
