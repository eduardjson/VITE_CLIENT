import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { useGetPriceHistoryByProductQuery } from "../../services/priceApi";

interface PriceHistoryProps {
  productId: string;
}

export const PriceHistory = ({ productId }: PriceHistoryProps) => {
  const { data: history, isLoading } =
    useGetPriceHistoryByProductQuery(productId);

  if (isLoading) return <Typography>Загрузка истории...</Typography>;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        История изменений цен
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Дата</TableCell>
              <TableCell>Категория</TableCell>
              <TableCell>Прайс-лист</TableCell>
              <TableCell>Закупка (было/стало)</TableCell>
              <TableCell>Розница (было/стало)</TableCell>
              <TableCell>Опт (было/стало)</TableCell>
              <TableCell>Причина</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history?.map(entry => (
              <TableRow key={entry.id}>
                <TableCell>
                  {new Date(entry.changedAt).toLocaleString()}
                </TableCell>
                <TableCell>{entry.price?.category?.name}</TableCell>
                <TableCell>{entry.price?.priceList?.name}</TableCell>
                <TableCell>
                  {entry.oldPurchasePrice ?? "-"} →{" "}
                  {entry.newPurchasePrice ?? "-"}
                </TableCell>
                <TableCell>
                  {entry.oldRetailPrice ?? "-"} → {entry.newRetailPrice ?? "-"}
                </TableCell>
                <TableCell>
                  {entry.oldWholesalePrice ?? "-"} →{" "}
                  {entry.newWholesalePrice ?? "-"}
                </TableCell>
                <TableCell>{entry.changeReason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
