import { CrudManagerPage } from "../../../../components/app/generic-crud-manager-page/generic-crud-manager-page.component";
import { MuffinShapeDto } from "../../../../models/muffin-shape/muffin-shape-dto.model";
import { muffinShapeService } from "../../../../services/manage-data/muffin-shape.service";
import { Input } from "antd";

export default function MuffinShapeCrudPage() {
  return (
    <CrudManagerPage<MuffinShapeDto>
      title="Gestión de Formas de Magdalenas"
      service={muffinShapeService}
      createEmptyItem={() => ({ reference: "", description: "" })}
      extraColumns={[
        { title: "Descripción", dataIndex: "description", key: "description" },
      ]}
      renderExtraFields={(item, handleChange) => (
        <Input
          placeholder="Descripción"
          value={item.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      )}
    />
  );
}
