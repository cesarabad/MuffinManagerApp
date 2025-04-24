import { Card, Button, Typography, Badge } from 'antd';
import { ProductStockResponseDto } from "../../../models/stock/product-stock/product-stock-dto.model";
import './product-stock-row.style.css';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

interface ProductStockRowProps {
  productStock: ProductStockResponseDto;
}

export function ProductStockRow({ productStock }: ProductStockRowProps) {
  const stockBadgeClass = productStock.stock > 0 ? 'stock-badge' : 'stock-badge zero';
    const { t } = useTranslation();
  return (
    <Card className="product-stock-card">
      <div>
        <div className="batch-header">
          <Text className="stock-batch">{productStock.batch}</Text>

          {productStock.packagePrint && (
            <Button
              className="print-button"
              onClick={() =>
                alert(`Imprimir etiqueta: ${productStock.packagePrint.reference} - ${productStock.packagePrint.description}`)
              }
            >
              {productStock.packagePrint.reference}
            </Button>
          )}
        </div>

        {productStock.observations && (
          <div className="stock-observations">{productStock.observations}</div>
        )}

        <div className="stock-value">
          {t('stock.label')}:{' '}
          <Badge
            count={productStock.stock}
            overflowCount={100000}
            className={stockBadgeClass}
          />{' '}
          {t('stock.unit')}
        </div>

        {productStock.reserves.length > 0 && (
          <div className="stock-reserves reserves-wrapper">
            <Button
              className="action-button reserves-button"
              onClick={() => alert('Consultar reservas')}
            >
              {t('stock.reserves')}
            </Button>

            <div>
              {productStock.reserves.map((reserve, index) => (
                <Badge
                  key={index}
                  count={`${reserve.destination}: ${reserve.units}${t('stock.unitLetter')}`}
                  className="stock-reserve-badge"
                />
              ))}
            </div>
          </div>
        )}

        <div className="stock-action-buttons">
          <Button
            className="action-button adjust-button"
            onClick={() => alert('Ajustar stock')}
          >
            {t('stock.adjust')}
          </Button>
          <Button
            className="action-button history-button"
            onClick={() => alert('Ver histórico')}
          >
            {t('stock.historic')}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default ProductStockRow;
