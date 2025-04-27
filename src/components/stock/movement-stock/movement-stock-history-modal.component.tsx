import React, { ReactNode, useEffect, useState } from "react";
import { Modal, Table, Button } from "antd";
import { movementStockService } from "../../../services/stock/movement-stock.service";
import { MovementStatus, MovementStock, MovementType } from "../../../models/stock/movement-stock/reserve-dto.model";
import "./movement-stock-history-modal.style.scss";
import { useTranslation } from "react-i18next";
import { useWebSocketListener } from "../../../services/web-socket-listenner.service";
import { useAuth } from "../../../contexts/auth/auth.context";
import { Permission } from "../../../models/index.model";

interface StockHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  productId?: number;
  productStockId?: number;
  description?: ReactNode;
}

const StockHistoryModal: React.FC<StockHistoryModalProps> = ({ visible, onClose, productId, productStockId, description }) => {
  const [data, setData] = useState<MovementStock[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState<number>(5);
  const [compactMode, setCompactMode] = useState<boolean>(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmContent, setConfirmContent] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => {});
  const { hasPermission } = useAuth();

  const calculatePageSize = (isCompact: boolean) => {
    const availableHeight = window.innerHeight;
    const estimatedRowHeight = isCompact ? 17 : 70;
    const headerHeight = 300;
    const usableHeight = availableHeight - headerHeight;
    return Math.max(1, Math.floor(usableHeight / estimatedRowHeight));
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      let result: MovementStock[];
      if (productId) {
        result = await movementStockService.getHistoricByProductId(productId);
      } else if (productStockId) {
        result = await movementStockService.getHistoricByProductStockId(productStockId);
      } else {
        result = await movementStockService.getHistoric();
      }
      setData(result);
    } catch (error) {
      console.error("Error fetching stock history:", error);
    } finally {
      setLoading(false);
    }
  };

  useWebSocketListener(`/topic${movementStockService.getPath()}`, async () => {
    if (visible) await fetchData();
  });
  
  useEffect(() => {
    const handleResize = () => {
      const calculated = calculatePageSize(compactMode);
      setPageSize(calculated);

      if ((calculated < 3 || window.innerWidth < 800) && !compactMode) {
        setCompactMode(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const recalculated = calculatePageSize(compactMode);
    setPageSize(recalculated);
  }, [compactMode, window.innerWidth]);


  

  useEffect(() => {
    if (visible) {
      document.body.classList.add("modal-open");
      
      setTimeout(() => {
        const calculated = calculatePageSize(compactMode);
        setPageSize(calculated);
      }, 0);

      fetchData();
      
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [visible]);

  
  const openConfirmModal = (action: () => void, title: string, content: string) => {
    setOnConfirmAction(() => action);
    setConfirmTitle(title);
    setConfirmContent(content);
    setConfirmVisible(true);
  };
  
  
  

  const handleUndoMovement = async (movementStockId: number) => {
    try {
      await movementStockService.undoMovement(movementStockId);
      fetchData();
    } catch (error) {
      console.error("Error undoing movement:", error);
    }
  };

  const handleEndReserve = async (movementStockId: number) => {
    try {
      await movementStockService.endReserve(movementStockId);
      fetchData();
    } catch (error) {
      console.error("Error ending reserve:", error);}
  };

  const columns = [
    ...(!productId && !productStockId
      ? [
          {
            title: t('stock.productLabel'),
            dataIndex: "productReference",
            key: "productReference",
          },
        ]
      : []),
    ...(productStockId
      ? []
      : [
          {
            title: t('stock.batchLabel'),
            dataIndex: "batch",
            key: "batch",
          },
        ]),
    {
      title: t('stock.type.name'),
      dataIndex: "type",
      key: "type",
      render: (type: MovementType) => t(`stock.type.${type.toLowerCase()}`),
    },
    {
      title: t('stock.unitsLabel'),
      dataIndex: "units",
      key: "units",
    },
    {
      title: t('stock.destinationLabel'),
      dataIndex: "destination",
      key: "destination",
    },
    {
      title: t('stock.status.name'),
      dataIndex: "status",
      key: "status",
      render: (status: MovementStatus) => t(`stock.status.${status.toLowerCase()}`),
    },
    {
      title: t('stock.observationsLabel'),
      dataIndex: "observations",
      key: "observations",
      width: compactMode ? 500 : 300,
    },
    {
      title: t('stock.responsibleLabel'),
      dataIndex: ["responsible", "id"],
      key: "responsible",
      render: (_: unknown, record: MovementStock) => `${record.responsible?.name || ""} ${record.responsible?.secondName || ""}`.trim(),
    },
    {
      title: t('stock.creationDateLabel'),
      dataIndex: "creationDate",
      key: "creationDate",
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: t('stock.endDateLabel'),
      dataIndex: "endDate",
      key: "endDate",
      render: (text: string) => (text ? new Date(text).toLocaleString() : t('stock.noEndDate')),
    },
    {
      title: t('stock.actions.name'),
      key: "actions",
      fixed: "right" as "right",
      render: (_: any, record: MovementStock) => (
        <div style={{ width: compactMode ? (window.innerWidth > 800 ? (window.innerWidth * 0.3 ).toString() + "px" : (window.innerWidth * 0.35).toString() + "px") : undefined }}>
          {record.type === MovementType.Reserve && record.status === MovementStatus.InProgress && (
            <Button 
            onClick={() => openConfirmModal(
              () => handleEndReserve(record.id!),
              `${t('stock.actions.endReserve')}`,
              `${t('stock.actions.askEndReserve')}`
            )}
            type="primary"
            style={{ marginRight: 8 }}
            disabled={!hasPermission(Permission.ManageMovementStock) && !hasPermission(Permission.ManageStock)}
          >
            {t('stock.actions.endReserve')}
          </Button>
          )}
          {record.status !== MovementStatus.Canceled && (<Button 
            onClick={() => openConfirmModal(
              () => handleUndoMovement(record.id!),
              `${t('stock.actions.undoMovement')}`,
              `${t('stock.actions.askUndoMovement')}`
            )}
            type="default"
            style={{ whiteSpace: "normal", wordBreak: "break-word", maxWidth: 150, padding: 3 }}
            disabled={!hasPermission(Permission.ManageMovementStock) && !hasPermission(Permission.ManageStock)}
          >
            {t('stock.actions.undoMovement')}
          </Button>)}
        </div>
      )
    },
  ];

  return (<>
    <Modal
      className={compactMode ? "compact-mode" : ""}
      title={
        <>
          {t('stock.historicLabel')}
          {description && (
            <>
              <br />
              {description}
            </>
          )}
        </>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={"95%"}
      destroyOnClose
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize }}
        scroll={{ x: "max-content" }}
        rowClassName={(record: MovementStock) => `movement-type-${record.type.toLowerCase()}`}
      />
    </Modal>
    <Modal
    open={confirmVisible}
    title={confirmTitle}
    onOk={() => {
      onConfirmAction();
      setConfirmVisible(false);
    }}
    onCancel={() => setConfirmVisible(false)}
    okText={t('button.confirm')}
    cancelText={t('button.cancel')}
  >
    <p>{confirmContent}</p>
  </Modal>
</>  
  );
};

export default StockHistoryModal;
