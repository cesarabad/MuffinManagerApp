import { useTranslation } from "react-i18next";
import { CrudManagerPage } from "../../../../components/app/generic-crud-manager-page/generic-crud-manager-page.component";
import { GenericInput } from "../../../../components/app/generic-form/generic-input.component";
import { PackagePrintDto } from "../../../../models/package-print/package-print-dto.model";
import { packagePrintService } from "../../../../services/manage-data/package-print.service";

export default function PackagePrintCrudPage() {
  const { t } = useTranslation();
  return (
    <CrudManagerPage<PackagePrintDto>
      title={t('manageData.packagePrint.page.title')}
      service={packagePrintService}
      createEmptyItem={() => ({ reference: "", description: "" })}
      extraColumns={[
        { title: t('manageData.packagePrint.page.reference.label'), dataIndex: "reference", key: "reference" },
        { title: t('manageData.packagePrint.page.description.label'), dataIndex: "description", key: "description", width: "400px" },
        { title: t('manageData.lastModifyDate'), dataIndex: "lastModifyDate", key: "lastModifyDate" },
        { 
          title: t('manageData.lastModifyUser'), 
          dataIndex: ["lastModifyUser", "id"],  
          key: "lastModifyUser",
          render: (_: unknown, record: PackagePrintDto) => `${record.lastModifyUser?.name || ""} ${record.lastModifyUser?.secondName || ""}`.trim()
        },
      ]}
      renderExtraFields={(item, handleChange) => (
        <>
          <GenericInput
            label={t('manageData.packagePrint.page.reference.label')}
            placeholder={t('manageData.packagePrint.page.reference.placeholder')}
            value={item?.reference || ""}
            onChange={(e) => handleChange("reference", e.target.value)}
            required={true}
            maxLength={12}
          />
          <GenericInput
            label={t('manageData.packagePrint.page.description.label')}
            placeholder={t('manageData.packagePrint.page.description.placeholder')}
            value={item.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            required={true}
            maxLength={255}
            type="textarea"
          />
        </>
      )}
    />
  );
}
