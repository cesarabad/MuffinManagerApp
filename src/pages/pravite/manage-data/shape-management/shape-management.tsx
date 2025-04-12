import { useTranslation } from "react-i18next";
import { CrudManagerPage } from "../../../../components/app/generic-crud-manager-page/generic-crud-manager-page.component";
import { MuffinShapeDto } from "../../../../models/muffin-shape/muffin-shape-dto.model";
import { muffinShapeService } from "../../../../services/manage-data/muffin-shape.service";
import { GenericInput } from "../../../../components/app/generic-form/generic-input.component";

export default function MuffinShapeCrudPage() {
  const { t } = useTranslation();
  return (
    <CrudManagerPage<MuffinShapeDto>
      title={t('manageData.muffinShape.page.title')}
      service={muffinShapeService}
      createEmptyItem={() => ({ reference: "", description: "" })}
      extraColumns={[
        { title: t('manageData.muffinShape.page.reference.label'), dataIndex: "reference", key: "reference" },
        { title: t('manageData.muffinShape.page.description.label'), dataIndex: "description", key: "description" },
        { title: t('manageData.lastModifyDate'), dataIndex: "lastModifyDate", key: "lastModifyDate" },
        { 
          title: t('manageData.lastModifyUser'), 
          dataIndex: ["lastModifyUser", "id"],  
          key: "lastModifyUser",
          render: (_: unknown, record: MuffinShapeDto) => `${record.lastModifyUser?.name || ""} ${record.lastModifyUser?.secondName || ""}`.trim()
        },
      ]}
      renderExtraFields={(item, handleChange) => (
        <>
          <GenericInput
            label={t('manageData.muffinShape.page.reference.label')}
            placeholder={t('manageData.muffinShape.page.reference.placeholder')}
            value={item?.reference || ""}
            onChange={(e) => handleChange("reference", e.target.value)}
            required={true}
            maxLength={10}
            pattern="^[a-zA-Z0-9_ ]*$" // Solo letras, números y guiones bajos
          />
          <GenericInput
            label={t('manageData.muffinShape.page.description.label')}
            placeholder={t('manageData.muffinShape.page.description.placeholder')}
            value={item.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            required={true}
            maxLength={80}
          />
        </>
      )}
    />
  );
}
