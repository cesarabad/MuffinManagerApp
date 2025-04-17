import { useTranslation } from "react-i18next";
import { CrudManagerPage } from "../../../../../components/app/generic-crud-manager-page/generic-crud-manager-page.component";
import { GenericInput } from "../../../../../components/app/generic-form/generic-input.component";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "../../../../../models/routes";
import { ProductDto } from "../../../../../models/product-data/product/product-dto.model";
import { useEffect, useState } from "react";
import { useWebSocketListener } from "../../../../../services/web-socket-listenner.service";
import { productService } from "../../../../../services/manage-data/product-data/product.service";
import { productItemService } from "../../../../../services/manage-data/product-data/product-item.service";
import { BoxDto } from "../../../../../models/box/box-dto.model";
import { boxService } from "../../../../../services/manage-data/box.service";
import { BoxSelectModalInput } from "../../../../../components/box/input/box-select-modal-input.component";
import { ProductItemSelectModalInput } from "../../../../../components/product-item/input/product-item-select-modal-input.component";
import { ProductItemDto } from "../../../../../models/product-data/product-item/product-item-dto.model";

export default function ProductPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [boxesList, setBoxesList] = useState<BoxDto[]>([]);
  const [productItemList, setProductItemList] = useState<ProductItemDto[]>([]);
  useEffect(() => {
    (async () => {
      await fetchBoxes();
      await fetchProductItems();
    })();
  }, []);

  

  const fetchBoxes = async () => {
    try {
      setBoxesList(await boxService.getAll());
    } catch (error) {
      console.error("Error fetching boxes:", error);
    }
  }

  const fetchProductItems = async () => {
    try {
      setProductItemList(await productItemService.getAll());
    } catch (error) {
      console.error("Error fetching product items:", error);
    }
  }


  useWebSocketListener(`/topic${boxService.getPath()}`, fetchBoxes);
  useWebSocketListener(`/topic${productItemService.getPath()}`, fetchProductItems);

return (
    <CrudManagerPage<ProductDto>
        title={t('manageData.productData.product.page.title')}
        service={productService}
        handleBack={() => navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.MANAGE_PRODUCTS_DATA}`)}
        createEmptyItem={() => ({})}
        manageVersions={true}
        extraColumns={[
            { title: t('manageData.productData.product.page.reference.label'), dataIndex: "reference", key: "reference" },
            { title: t('manageData.productData.product.page.productItem.label'), dataIndex: "productItemId", key: "productItemId",
                render: (_: unknown, record: ProductDto) => {
                    return record.productItemInfo;
                },
                width: 200,
            },
            { title: t('manageData.productData.product.page.itemsPerProduct.label'), dataIndex: ["itemsPerProduct"], key: "itemsPerProduct" },
            { title : t('manageData.productData.product.page.ean14.label'), dataIndex: "ean14", key: "ean14" },
            { title: t('manageData.productData.product.page.box.label'), dataIndex: "boxId", key: "boxId",
                render: (_: unknown, record: ProductDto) => {
                    return record.boxInfo;
                },
                width: 150,
            },

            { title: t('manageData.aliasVersion'), dataIndex: "aliasVersion", key: "aliasVersion" },
            { title: t('manageData.obsolete'), dataIndex: "obsolete", key: "obsolete" },
            { title: t('manageData.creationDate') , dataIndex: "creationDate", key: "creationDate" },
            { title: t('manageData.endDate'), dataIndex: "endDate", key: "endDate" },
            { title: t('manageData.lastModifyDate'), dataIndex: "lastModifyDate", key: "lastModifyDate" },
            { 
                title: t('manageData.lastModifyUser'), 
                dataIndex: ["lastModifyUser", "id"],  
                key: "lastModifyUser",
                render: (_: unknown, record: ProductDto) => `${record.lastModifyUser?.name || ""} ${record.lastModifyUser?.secondName || ""}`.trim()
            },
        ]}
        renderExtraFields={(item, handleChange) => (
            <>
                <GenericInput
                    label={t('manageData.productData.product.page.reference.label')}
                    placeholder={t('manageData.productData.product.page.reference.placeholder')}
                    value={item?.reference || ""}
                    onChange={(e) => handleChange("reference", e.target.value)}
                    required={true}
                    maxLength={20}
                />
                <ProductItemSelectModalInput
                    label={t('manageData.productData.product.page.productItem.label')}
                    value={item.productItemId}
                    productItemList={productItemList}
                    onChange={(value) => handleChange("productItemId", (value ?? "").toString())}
                />

                <BoxSelectModalInput
                    label={t('manageData.productData.product.page.box.label')}
                    value={item.boxId}
                    boxList={boxesList}
                    onChange={(value) => handleChange("boxId", (value ?? "").toString())}
                />

                <GenericInput
                    label={t('manageData.productData.product.page.itemsPerProduct.label')}
                    placeholder={t('manageData.productData.product.page.itemsPerProduct.placeholder')}
                    value={item.itemsPerProduct || ""}
                    onChange={(e) => handleChange("itemsPerProduct", e.target.value)}
                />

                <GenericInput
                    label={t('manageData.productData.product.page.ean14.label')}
                    placeholder={t('manageData.productData.product.page.ean14.placeholder')}
                    value={item.ean14 || ""}
                    onChange={(e) => handleChange("ean14", e.target.value)}
                    maxLength={14}
                />

                <GenericInput
                    label={t('manageData.productData.product.page.aliasVersion.label')}
                    placeholder={t('manageData.productData.product.page.aliasVersion.placeholder')}
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
