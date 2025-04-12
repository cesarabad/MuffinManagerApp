import { useEffect, useState } from "react";
import { Card, Typography } from "antd";
import { GenericForm } from "../generic-form/generic-form.component";
import { GenericTable } from "../generic-table/generic-table.component";
import { GenericDto } from "../../../models/generic-version-model/generic-version-dto.model";
import { genericCrudServiceInterface } from "../../../services/manage-data/generic-crud.service";
import PageContainer from "../generic-page-container/PageContainer.component";
import 'antd/dist/reset.css'; // Asegúrate de tener esto o similar en tu entry point
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useWebSocketListener } from "../../../services/web-socket-listenner.service";


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
  const { t } = useTranslation();
  const handleWsMessage = () => {
    fetchData();
  };

  useWebSocketListener(`/topic${service.getPath()}`, handleWsMessage);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await service.getAll();
      setData(result);
    } catch {
      toast.error(t("error.fetchData"));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof T, value: string) => {
    setCurrentItem((prev) => ({ ...(prev || createEmptyItem()), [field]: value }));
  };

  const handleSubmit = async () => {
    if (!currentItem) {
      return;
    }

    try {
      if (currentItem.id) {
        await service.update(currentItem);
      } else {
        await service.insert(currentItem);
      }
      
      fetchData();
      setCurrentItem(null);
    } catch {
      toast.error(t("error.save"));
    }
  };
  
  const handleDelete = async (item: T) => {
    try {
      await service.deleteById(item.id ?? -1);
      fetchData();
    } catch {
      toast.error(t("error.delete"));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContainer>
      <Title level={4}>{title}</Title>

      <Card title={currentItem?.id ? t('manageData.edit') : t('manageData.create')} style={{ marginBottom: 20 }}>
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
