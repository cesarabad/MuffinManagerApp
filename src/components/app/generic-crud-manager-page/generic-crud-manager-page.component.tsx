import { useEffect, useState } from "react";
import { Card, Typography, Modal, Input, Form, Button } from "antd";
import { GenericForm } from "../generic-form/generic-form.component";
import { GenericTable } from "../generic-table/generic-table.component";
import { GenericDto, GenericVersionDto } from "../../../models/generic-version-model/generic-version-dto.model";
import { genericCrudServiceInterface } from "../../../services/manage-data/generic-crud.service";
import PageContainer from "../generic-page-container/PageContainer.component";
import 'antd/dist/reset.css';
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useWebSocketListener } from "../../../services/web-socket-listenner.service";
import { useAuth } from "../../../contexts/auth/auth.context";
import { Permission } from "../../../models/index.model";
import { genericCrudVersionServiceInterface } from "../../../services/manage-data/generic-crud-version.service";

const { Title } = Typography;

interface CrudManagerPageProps<T extends GenericDto> {
  title: string;
  service: genericCrudServiceInterface<T>;
  manageVersions?: boolean;
  createEmptyItem: () => T;
  extraColumns?: any[];
  renderExtraFields?: (item: T, handleChange: (field: keyof T, value: string) => void) => React.ReactNode;
}
export const GET_ALL = "getAll";
export const GET_OBSOLETES = "getObsoletes";

export function CrudManagerPage<T extends GenericDto>({
  title,
  service,
  manageVersions = false,
  createEmptyItem,
  extraColumns,
  renderExtraFields,
}: CrudManagerPageProps<T>) {
  
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentItem, setCurrentItem] = useState<T | null>(null);
  const [isAliasModalVisible, setIsAliasModalVisible] = useState(false);
  const [aliasValue, setAliasValue] = useState('');
  const [aliasLoading, setAliasLoading] = useState(false);
  const [isNewVersionModalVisible, setIsNewVersionModalVisible] = useState(false);
  const [isObsoleteAllReferenceModalVisible, setIsObsoleteAllReferenceModalVisible] = useState(false);
  const [list, setList] = useState(GET_ALL);
  const { t } = useTranslation();
  const { hasPermission } = useAuth();

  const handleWsMessage = () => {
    fetchData();
  };

  useWebSocketListener(`/topic${service.getPath()}`, handleWsMessage);

  const fetchData = async () => {
    setLoading(true);
    try {
      let result = [] as T[];
      switch (list) {
        case GET_ALL:
          result = await (service as genericCrudServiceInterface<T>).getAll();
          break;
        case GET_OBSOLETES:
            result = await (service as genericCrudVersionServiceInterface<T>).getObsoletes();
            break;
      }
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
    if (!currentItem) return;
    if (currentItem.id && manageVersions) {
      setIsNewVersionModalVisible(true);
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

  const handleConfirmNewVersion = () => {
    
    setAliasValue((data.find(element => element.id == currentItem?.id) as GenericVersionDto).aliasVersion == (currentItem as GenericVersionDto).aliasVersion ? '': (currentItem as GenericVersionDto).aliasVersion ?? '');
    setIsNewVersionModalVisible(false);
    setIsAliasModalVisible(true);
  };

  const handleConfirmObsoleteAllReference = async () => {
    if (currentItem?.reference) {
      await (service as genericCrudVersionServiceInterface<T>).setObsoleteByReference(currentItem.reference, !(currentItem as GenericVersionDto).obsolete)
          .then(async () => {
              await fetchData();
              setCurrentItem(null); 
          }
      );
      
    }
    setIsObsoleteAllReferenceModalVisible(false);
  }

  
  const handleNoNewVersion = async () => {
    if (currentItem) {
      await service.update(currentItem).then(async () => {
        await fetchData();
        setCurrentItem(null);
      });
    }
    setIsNewVersionModalVisible(false);
  };

  const handleNoObsoleteAllReference = async () => {
    if (currentItem?.id) {
      await (service as genericCrudVersionServiceInterface<T>).setObsoleteById(currentItem.id, !(currentItem as GenericVersionDto).obsolete)
          .then(async () => {
              await fetchData();
              setCurrentItem(null); 
          }
      );
      
    }
    setIsObsoleteAllReferenceModalVisible(false);
  }



  const handleCancelModal = () => {
    setIsNewVersionModalVisible(false);
    setIsObsoleteAllReferenceModalVisible(false);
  };


  const handleVersionAliasConfirm = async () => {
    if (!aliasValue.trim()) {
      toast.error(t("manageData.versionAliasRequired"));
      return;
    }

    try {
      setAliasLoading(true);
      if (currentItem) {
        currentItem.id = undefined;
        (currentItem as GenericVersionDto).aliasVersion = aliasValue;
        await service.insert(currentItem);
      }
      setIsAliasModalVisible(false);
      setAliasValue('');
      await fetchData();
      setCurrentItem(null);
    } catch {
      toast.error(t("error.save"));
    } finally {
      setAliasLoading(false);
    }
  };

  const handleDelete = async (item: T, selectedOption: string) => {
    try {
      switch (selectedOption) {
        case "this-version":
          await service.deleteById(item.id ?? -1);
          break;
        case "full-reference":
          await (service as genericCrudVersionServiceInterface<T>).deleteByReference(item.reference ?? '');
          break;
        default:
          await service.deleteById(item.id ?? -1);
          break;
      }
      
      await fetchData();
    } catch {
      toast.error(t("error.delete"));
    }
  };


  const handleOnChangeList = (item: string) => {
    setList(item);
  }

  useEffect(() => {
    fetchData();
  }, [list]);


  return (
    <PageContainer>
      <Title level={4}>{title}</Title>

      {hasPermission(Permission.ManageData) && (
        <Card title={currentItem?.id ? t('manageData.edit') : t('manageData.create')} style={{ marginBottom: 20 }}>
          <GenericForm<T>
            item={currentItem || createEmptyItem()}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onReset={() => {setCurrentItem(null)}}
            onClickObsolete={() => setIsObsoleteAllReferenceModalVisible(true)}
            manageVersions = {manageVersions}
          >
            {renderExtraFields?.(currentItem || createEmptyItem(), handleChange)}
          </GenericForm>
        </Card>
      )}
      
      <GenericTable<T>
        data={data}
        loading={loading}
        manageVersions={manageVersions}
        onEdit={(item) => setCurrentItem(item)}
        onDelete={handleDelete}
        extraColumns={extraColumns}
        onChange={handleOnChangeList}
      />

      

      {manageVersions && (
        <>
          <Modal
            title={t("manageData.modal.versionAliasTitle")}
            open={isAliasModalVisible}
            onOk={handleVersionAliasConfirm}
            onCancel={() => {setIsAliasModalVisible(false);setAliasValue('');}}
            okText={t("button.confirm")}
            cancelText={t("button.cancel")}
            confirmLoading={aliasLoading}
          >
            <Form layout="vertical">
              <Form.Item
                label={t("manageData.modal.versionAliasLabel")}
                required
                validateStatus={!aliasValue.trim() ? 'error' : ''}
                help={!aliasValue.trim() ? t("validation.required") : ''}
              >
                <Input
                  value={aliasValue}
                  onChange={(e) => setAliasValue(e.target.value)}
                  placeholder={t("manageData.brand.page.aliasVersion.placeholder")}
                  maxLength={50}
                  autoFocus
                />
              </Form.Item>
            </Form>
          </Modal>
            <Modal
            title={t("manageData.modal.createNewVersion", { dato: "una marca" })}
            open={isNewVersionModalVisible}
            footer={null}
            onCancel={handleCancelModal}
              >
            {t("manageData.modal.createNewVersionDescription")}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
              <Button onClick={handleCancelModal}>
              {t("button.cancel")}
              </Button>
              <Button danger onClick={handleNoNewVersion}>
              {t("manageData.modal.actualVersion")}
              </Button>
              <Button type="primary" onClick={handleConfirmNewVersion}>
              {t("manageData.modal.newVersion")}
              </Button>
            </div>
            </Modal>

          <Modal
            title={(currentItem as GenericVersionDto)?.obsolete
              ? t("manageData.modal.removeObsoleteTitle", { dato: t('manageData.modal.data.brand') })
              : t("manageData.modal.setObsoleteTitle", { dato: t('manageData.modal.data.brand') })}
            open={isObsoleteAllReferenceModalVisible}
            footer={null}
            onCancel={handleCancelModal}
              >
            {t("manageData.modal.setObsoleteDescription")}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
              <Button onClick={handleCancelModal}>
                {t("button.cancel")}
              </Button>
              <Button danger onClick={handleNoObsoleteAllReference}>
                {t("manageData.modal.actualVersion")}
              </Button>
              <Button type="primary" onClick={handleConfirmObsoleteAllReference}>
                {t("manageData.modal.allReference")}
              </Button>
            </div>
          </Modal>

        </>
      )}

    </PageContainer>
  );
}
