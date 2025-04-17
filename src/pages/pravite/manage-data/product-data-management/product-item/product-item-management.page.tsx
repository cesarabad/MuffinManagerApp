import { useTranslation } from "react-i18next";
import { CrudManagerPage } from "../../../../../components/app/generic-crud-manager-page/generic-crud-manager-page.component";
import { GenericInput } from "../../../../../components/app/generic-form/generic-input.component";
import { BaseProductItemDto } from "../../../../../models/product-data/base-product-item/base-product-item-dto.model";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "../../../../../models/routes";
import { ProductItemDto } from "../../../../../models/product-data/product-item/product-item-dto.model";
import { productItemService } from "../../../../../services/manage-data/product-data/product-item.service";
import { useEffect, useState } from "react";
import { baseProductItemService } from "../../../../../services/manage-data/product-data/base-product-item.service";
import { useWebSocketListener } from "../../../../../services/web-socket-listenner.service";
import { BrandDto } from "../../../../../models/brand/brand-dto.model";
import { brandService } from "../../../../../services/manage-data/brand.service";
import { BrandSelectModalInput } from "../../../../../components/brand/input/brand-select-modal-input.component";
import { BaseProductItemSelectModalInput } from "../../../../../components/product-data/base-product-item/base-product-item-modal-input.component";
import { MuffinShapeDto } from "../../../../../models/muffin-shape/muffin-shape-dto.model";
import { muffinShapeService } from "../../../../../services/manage-data/muffin-shape.service";

export default function ProductItemPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [baseProductItemList, setBaseProductItemList] = useState<BaseProductItemDto[]>([]);
  const [brandList, setBrandList] = useState<BrandDto[]>([]);
  const [muffinShapeList, setMuffinShapeList] = useState<MuffinShapeDto[]>([]);

  useEffect(() => {
    fetchBaseProductItems();
    fetchBrands();
    fetchMuffinShapes();
  }, []);

  const fetchBaseProductItems = async () => {
    try {
      setBaseProductItemList(await baseProductItemService.getAll());
    } catch (error) {
      console.error("Error fetching base product items:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      setBrandList(await brandService.getAll());
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  }

  const fetchMuffinShapes = async () => {
    try {
      setMuffinShapeList(await muffinShapeService.getAll());
    } catch (error) {
      console.error("Error fetching muffin shapes:", error);
    }
  }
      
  useWebSocketListener(`/topic${baseProductItemService.getPath()}`, fetchBaseProductItems);
  useWebSocketListener(`/topic${brandService.getPath()}`, fetchBrands);
  useWebSocketListener(`/topic${muffinShapeService.getPath()}`, fetchMuffinShapes);

return (
    <CrudManagerPage<ProductItemDto>
        title={t('manageData.productData.productItem.page.title')}
        service={productItemService}
        handleBack={() => navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.MANAGE_PRODUCTS_DATA}`)}
        createEmptyItem={() => ({})}
        manageVersions={true}
        extraColumns={[
            { title: t('manageData.productData.productItem.page.reference.label'), dataIndex: "reference", key: "reference" },
            { 
                title: t('manageData.productData.productItem.page.baseProductItem.label'), 
                dataIndex: "baseProductItem", 
                key: "baseProductItem",
                render: (_: unknown, record: ProductItemDto) => {
                    const baseProductItem = baseProductItemList.find(item => item.id === record.baseProductItemId);
                    const muffinShape = muffinShapeList.find(item => item.id === baseProductItem?.muffinShape);
                    return `${baseProductItem?.reference} - ${muffinShape?.description} ${baseProductItem?.mainDescription || ""} ${baseProductItem?.unitsPerItem} UDS`.trim();
                },
                width: "200px"
            },
            { 
                title: t('manageData.productData.productItem.page.brand.label'), 
                dataIndex: "brand", 
                key: "brand",
                render: (_: unknown, record: ProductItemDto) => {
                    const brand = brandList.find(item => item.id === record.brandId);
                    return brand?.name || "";
                }
            },
            { title: t('manageData.aliasVersion'), dataIndex: "aliasVersion", key: "aliasVersion" },
            { title : t('manageData.productData.productItem.page.ean13.label'), dataIndex: "ean13", key: "ean13" },
            { title: t('manageData.obsolete'), dataIndex: "obsolete", key: "obsolete" },
            { title: t('manageData.creationDate') , dataIndex: "creationDate", key: "creationDate" },
            { title: t('manageData.endDate'), dataIndex: "endDate", key: "endDate" },
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
                    label={t('manageData.productData.productItem.page.reference.label')}
                    placeholder={t('manageData.productData.productItem.page.reference.placeholder')}
                    value={item?.reference || ""}
                    onChange={(e) => handleChange("reference", e.target.value)}
                    required={true}
                    maxLength={20}
                />

                <BrandSelectModalInput
                    label={t('manageData.productData.productItem.page.brand.label')}
                    value={item.brandId}
                    brandList={brandList}
                    onChange={(value) => handleChange("brandId", (value ?? "").toString())}
                    required={true}
                />

                <BaseProductItemSelectModalInput
                    label={t('manageData.productData.productItem.page.baseProductItem.label')}
                    value={item.baseProductItemId}
                    baseProductItemList={baseProductItemList}
                    muffinShapeList={muffinShapeList}
                    onChange={(value) => handleChange("baseProductItemId", (value ?? "").toString())}
                    required={true}
                />

                

                <GenericInput
                    label={t('manageData.productData.productItem.page.ean13.label')}
                    placeholder={t('manageData.productData.productItem.page.ean13.placeholder')}
                    value={item.ean13 || ""}
                    onChange={(e) => handleChange("ean13", e.target.value)}
                    maxLength={13}
                />

                <GenericInput
                    label={t('manageData.productData.productItem.page.aliasVersion.label')}
                    placeholder={t('manageData.productData.productItem.page.aliasVersion.placeholder')}
                    value={item.aliasVersion || ""}
                    onChange={(e) => handleChange("aliasVersion", e.target.value)}
                    maxLength={50}
                    type="textarea"
                />
            </>
        )}
    />
);
}
