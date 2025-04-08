import { useEffect, useState } from "react";
import { Card, Typography, message } from "antd";
import { GenericForm } from "../generic-form/generic-form.component";
import { GenericTable } from "../generic-table/generic-table.component";
import { GenericDto } from "../../../models/generic-version-model/generic-version-dto.model";
import { genericCrudServiceInterface } from "../../../services/manage-data/generic-crud.service";
import PageContainer from "../generic-page-container/PageContainer.component";

const { Title } = Typography;

interface CrudManagerPageProps<T extends GenericDto> {
  title: string;
  service: genericCrudServiceInterface<T>;
  createEmptyItem: () => T;
  extraColumns?: any[]; // optional for custom columns
  renderExtraFields?: (item: T, handleChange: (field: keyof T, value: string) => void) => React.ReactNode;
}

export function CrudManagerPage<T extends GenericDto>({
  title,
  service,
  createEmptyItem,
  extraColumns,
  renderExtraFields,
}: CrudManagerPageProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentItem, setCurrentItem] = useState<T | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await service.getAll();
      setData(result);
    } catch {
      message.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof T, value: string) => {
    setCurrentItem((prev) => ({ ...(prev || createEmptyItem()), [field]: value }));
  };

  const handleSubmit = async () => {
    if (!currentItem?.reference) {
      message.warning("Completa todos los campos");
      return;
    }

    try {
      await service.insert(currentItem);
      message.success(currentItem.id ? "Elemento actualizado" : "Elemento añadido");
      fetchData();
      setCurrentItem(null);
    } catch {
      message.error("Error al guardar");
    }
  };

  const handleDelete = async (item: T) => {
    try {
      await service.deleteById(item.id ?? -1);
      message.success("Elemento eliminado");
      fetchData();
    } catch {
      message.error("Error al eliminar");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContainer>
      <Title level={4}>{title}</Title>

      <Card title={currentItem?.id ? "Editar" : "Nuevo"} style={{ marginBottom: 20 }}>
      <GenericForm<T>
            item={currentItem || createEmptyItem()}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onReset={() => setCurrentItem(null)}
            >
            {renderExtraFields?.(currentItem || createEmptyItem(), handleChange)}
        </GenericForm>

      </Card>

      <GenericTable<T>
        data={data}
        loading={loading}
        onEdit={(item) => setCurrentItem(item)}
        onDelete={handleDelete}
        extraColumns={extraColumns}
      />
    </PageContainer>
  );
}
