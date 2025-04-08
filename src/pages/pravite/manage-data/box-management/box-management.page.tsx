import { CrudManagerPage } from "../../../../components/app/generic-crud-manager-page/generic-crud-manager-page.component";
import { BoxDto } from "../../../../models/box/box-dto.model";
import { boxService } from "../../../../services/manage-data/box.service";
import { Input } from "antd";

export default function BoxPage() {
  return (
    <CrudManagerPage<BoxDto>
      title="Gestión de Cajas de Magdalenas"
      service={boxService}
      createEmptyItem={() => ({ reference: "", description: "" })}
      extraColumns={[
        { title: "Descripción", dataIndex: "description", key: "description" },
        { title: "Base EUR", dataIndex: "europeanBase", key: "europeanBase" },
        { title: "Base USD", dataIndex: "americanBase", key: "americanBase" },
        { title: "Altura", dataIndex: "defaultHeight", key: "defaultHeight" },
      ]}
      renderExtraFields={(item, handleChange) => (
        <>
            <Input
            placeholder="Descripción"
            value={item.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            />

            <Input
            placeholder="Base EUR"
            value={item.europeanBase || ""}
            onChange={(e) => handleChange("europeanBase", e.target.value)}
            />

            <Input
            placeholder="Base USD"
            value={item.americanBase || ""}
            onChange={(e) => handleChange("americanBase", e.target.value)}
            />

            <Input
            placeholder="Altura por defecto"
            value={item.defaultHeight || ""}
            onChange={(e) => handleChange("defaultHeight", e.target.value)}
            />
        </>
      )}
    />
  );
}
