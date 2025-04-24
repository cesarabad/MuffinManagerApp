import React, { useEffect, useState } from "react";
import { Modal, Table, Button, message } from "antd";
import { movementStockService } from "../../../services/stock/movement-stock.service";
import { MovementStatus, MovementStock, MovementType } from "../../../models/stock/movement-stock/reserve-dto.model";
import "./movement-stock-history-modal.style.scss";

interface StockHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  productId?: number;
  productStockId?: number;
}

const StockHistoryModal: React.FC<StockHistoryModalProps> = ({ visible, onClose, productId, productStockId }) => {
  const [data, setData] = useState<MovementStock[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      fetchData();
    }
  }, [visible]);

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
      message.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleUndoMovement = async (movementStockId: number) => {
    try {
      await movementStockService.undoMovement(movementStockId);
      message.success("Movement undone");
      fetchData(); // Refresh data after undo
    } catch (error) {
      message.error("Error undoing movement");
    }
  };

  const handleEndReserve = async (movementStockId: number) => {
    try {
      await movementStockService.endReserve(movementStockId);
      message.success("Reserve ended");
      fetchData(); // Refresh data after ending reserve
    } catch (error) {
      message.error("Error ending reserve");
    }
  };

  const columns = [
    {
        title: "ID",
        dataIndex: "id",
        key: "id",
    },
    {
      title: "Batch",
      dataIndex: "batch",
      key: "batch",
    },
    {
      title: "Product",
      dataIndex: "productReference",
      key: "productReference",
    },
    {
      title: "Units",
      dataIndex: "units",
      key: "units",
    },
    {
      title: "Destination",
      dataIndex: "destination",
      key: "destination",
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
    },
    {
      title: "Date",
      dataIndex: "creationDate",
      key: "creationDate",
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: MovementStock) => (
        <div>
          {record.type === MovementType.Reserve && record.status === MovementStatus.InProgress && (
            <Button onClick={() => handleEndReserve(record.id)} type="primary" style={{ marginRight: 8 }}>
              End Reserve
            </Button>
          )}
          {record.status !== MovementStatus.Canceled && (<Button onClick={() => handleUndoMovement(record.id)} type="default">
            Undo Movement
          </Button>)}
        </div>
      ),
    },
  ];

  return (
    <Modal
      title="Stock Movement History"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        scroll={{ x: true }}
      />
    </Modal>
  );
};

export default StockHistoryModal;
