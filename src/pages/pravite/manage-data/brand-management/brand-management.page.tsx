import { useTranslation } from "react-i18next";
import { CrudManagerPage } from "../../../../components/app/generic-crud-manager-page/generic-crud-manager-page.component";
import { GenericInput } from "../../../../components/app/generic-form/generic-input.component";
import { brandService } from "../../../../services/manage-data/brand.service";
import { BrandDto } from "../../../../models/brand/brand-dto.model";
import { GenericImageInput } from "../../../../components/app/generic-form/generic-image-input.component";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "../../../../models/routes";

export default function BrandPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
return (
    <CrudManagerPage<BrandDto>
        title={t('manageData.brand.page.title')}
        service={brandService}
        manageVersions={true}
        handleBack={() => navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.MANAGE_DATA}`)}
        createEmptyItem={() => ({ name: "", logoBase64: "" })}
        extraColumns={[
            { title: t('manageData.brand.page.reference.label'), dataIndex: "reference", key: "reference" },
            { title: t('manageData.brand.page.name.label'), dataIndex: "name", key: "name" },
            { title: t('manageData.brand.page.logo.label'), dataIndex: "logoBase64", key: "logoBase64",
                render: (base64: string) =>
                    base64 ? (
                      <img
                        src={`data:image/png;base64,${base64}`}
                        alt="logo"
                        style={{ width: "auto", height: "50px", objectFit: "contain" }}
                      />
                    ) : null, },
            { title: t('manageData.aliasVersion'), dataIndex: "aliasVersion", key: "aliasVersion" },
            { 
                title: t('manageData.obsolete'), 
                dataIndex: "obsolete", 
                key: "obsolete", 
                render: (obsolete: boolean) => obsolete ? t('boolean.true') : t('boolean.false') 
            },
            { title: t('manageData.creationDate'), dataIndex: "creationDate", key: "creationDate" },
            { title: t('manageData.endDate'), dataIndex: "endDate", key: "endDate" },
            { title: t('manageData.lastModifyDate'), dataIndex: "lastModifyDate", key: "lastModifyDate" },
            { 
                title: t('manageData.lastModifyUser'), 
                dataIndex: ["lastModifyUser", "id"],  
                key: "lastModifyUser",
                render: (_: unknown, record: BrandDto) => `${record.lastModifyUser?.name || ""} ${record.lastModifyUser?.secondName || ""}`.trim()
            },
        ]}
        renderExtraFields={(item, handleChange) => (
            <>
                    <GenericInput
                        label={t('manageData.brand.page.reference.label')}
                        placeholder={t('manageData.brand.page.reference.placeholder')}
                        value={item?.reference || ""}
                        onChange={(e) => handleChange("reference", e.target.value)}
                        required={true}
                        maxLength={20}
                    />

                    <GenericInput
                        label={t('manageData.brand.page.name.label')}
                        placeholder={t('manageData.brand.page.name.placeholder')}
                        value={item?.name || ""}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required={true}
                        maxLength={80}
                    />
                    <GenericImageInput
                        label={t('manageData.brand.page.logo.label')}
                        value={item?.logoBase64 || ""}
                        onChange={(base64) => handleChange("logoBase64", base64 || "")}
                    />
                    <GenericInput
                        label={t('manageData.brand.page.aliasVersion.label')}
                        placeholder={t('manageData.brand.page.aliasVersion.placeholder')}
                        value={item?.aliasVersion || ""}
                        onChange={(e) => handleChange("aliasVersion", e.target.value)}
                        type="textarea"
                        maxLength={50}
                    />
            </>
        )}
    />
);
}
