import { useTranslation } from "react-i18next";
import { CrudManagerPage } from "../../../../components/app/generic-crud-manager-page/generic-crud-manager-page.component";
import { GenericInput } from "../../../../components/app/generic-form/generic-input.component";
import { BoxDto } from "../../../../models/box/box-dto.model";
import { boxService } from "../../../../services/manage-data/box.service";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "../../../../models/routes";

export default function BoxPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <CrudManagerPage<BoxDto>
      title={t('manageData.box.page.title')}
      service={boxService}
      createEmptyItem={() => ({ reference: "", description: "" })}
      handleBack={() => navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.MANAGE_DATA}`)}
      extraColumns={[
        { title: t('manageData.box.page.reference.label'), dataIndex: "reference", key: "reference" },
        { title: t('manageData.box.page.description.label'), dataIndex: "description", key: "description" },
        { title: t('manageData.box.page.baseEur.label'), dataIndex: "europeanBase", key: "europeanBase" },
        { title: t('manageData.box.page.baseUsd.label'), dataIndex: "americanBase", key: "americanBase" },
        { title: t('manageData.box.page.defaultHeight.label'), dataIndex: "defaultHeight", key: "defaultHeight" },
        { title: t('manageData.lastModifyDate'), dataIndex: "lastModifyDate", key: "lastModifyDate" },
        { 
          title: t('manageData.lastModifyUser'), 
          dataIndex: ["lastModifyUser", "id"],  
          key: "lastModifyUser",
          render: (_: unknown, record: BoxDto) => `${record.lastModifyUser?.name || ""} ${record.lastModifyUser?.secondName || ""}`.trim()
        },
      ]}
      renderExtraFields={(item, handleChange) => (
        <>
            <GenericInput
              label={t('manageData.box.page.reference.label')}
              placeholder={t('manageData.box.page.reference.placeholder')}
              value={item?.reference || ""}
              onChange={(e) => handleChange("reference", e.target.value)}
              required={true}
              maxLength={20}
            />
            <GenericInput
              label={t('manageData.box.page.description.label')}
              placeholder={t('manageData.box.page.description.placeholder')}
              value={item.description || ""}
              onChange={(e) => handleChange("description", (e.target as HTMLInputElement).value)}
              required={true}
              maxLength={80}
            />
            <GenericInput
              label={t('manageData.box.page.baseEur.label')}
              placeholder={t('manageData.box.page.baseEur.placeholder')}
              value={item.europeanBase || ""}
              onChange={(e) => handleChange("europeanBase", e.target.value)}
              type="number"
              inputMode="numeric"
            />
            <GenericInput
              label={t('manageData.box.page.baseUsd.label')}
              placeholder={t('manageData.box.page.baseUsd.placeholder')}
              value={item.americanBase || ""}
              onChange={(e) => handleChange("americanBase", e.target.value)}
              type="number"
              inputMode="numeric"
            />
            <GenericInput
              label={t('manageData.box.page.defaultHeight.label')}
              placeholder={t('manageData.box.page.defaultHeight.placeholder')}
              value={item.defaultHeight || ""}
              onChange={(e) => handleChange("defaultHeight", e.target.value)}
              type="number"
              inputMode="numeric"
            />
        </>
      )}
    />
  );
}
