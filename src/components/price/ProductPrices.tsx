import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { Edit, Delete, Add, History } from "@mui/icons-material";
import {
  useGetPricesQuery,
  useCreatePriceMutation,
  useUpdatePriceMutation,
  useDeletePriceMutation,
  useGetPriceListsQuery,
  useGetCategoriesQuery,
} from "../../services/priceApi";
import { useGetProductsQuery } from "../../services/productApi"; // ваш API продуктов

interface ProductPricesProps {
  productId: string;
}

export const ProductPrices = ({ productId }: ProductPricesProps) => {
  const { data: prices, isLoading } = useGetPricesQuery({ productId });
  const { data: priceLists } = useGetPriceListsQuery(true);
  const { data: categories } = useGetCategoriesQuery();
  const [createPrice] = useCreatePriceMutation();
  const [updatePrice] = useUpdatePriceMutation();
  const [deletePrice] = useDeletePriceMutation();

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<any>(null);

  const handleOpen = (price?: any) => {
    if (price) {
      setCurrent(price);
    } else {
      setCurrent({
        productId,
        priceListId: "",
        categoryId: "",
        purchasePrice: 0,
        retailPrice: 0,
        wholesalePrice: 0,
        minMarkup: "",
        maxDiscount: "",
        bulkThreshold: "",
        bulkPrice: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    const dto = {
      ...current,
      minMarkup: current.minMarkup ? Number(current.minMarkup) : undefined,
      maxDiscount: current.maxDiscount
        ? Number(current.maxDiscount)
        : undefined,
      bulkThreshold: current.bulkThreshold
        ? Number(current.bulkThreshold)
        : undefined,
      bulkPrice: current.bulkPrice ? Number(current.bulkPrice) : undefined,
    };
    if (current.id) {
      await updatePrice({ id: current.id, body: dto });
    } else {
      await createPrice(dto);
    }
    handleClose();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Удалить цену?")) await deletePrice(id);
  };

  if (isLoading) return <Typography>Загрузка...</Typography>;

  return (
    <Box>
      <Button
        startIcon={<Add />}
        variant="contained"
        onClick={() => handleOpen()}
      >
        Добавить цену
      </Button>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Прайс-лист</TableCell>
              <TableCell>Категория</TableCell>
              <TableCell>Закупка</TableCell>
              <TableCell>Розница</TableCell>
              <TableCell>Опт</TableCell>
              <TableCell>Порог опта</TableCell>
              <TableCell>Скидка макс</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prices?.map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.priceList?.name}</TableCell>
                <TableCell>{p.category?.name}</TableCell>
                <TableCell>{p.purchasePrice}</TableCell>
                <TableCell>{p.retailPrice}</TableCell>
                <TableCell>{p.wholesalePrice}</TableCell>
                <TableCell>
                  {p.bulkThreshold
                    ? `${p.bulkThreshold} шт. = ${p.bulkPrice}`
                    : "-"}
                </TableCell>
                <TableCell>
                  {p.maxDiscount ? `${p.maxDiscount}%` : "-"}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(p)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(p.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {current?.id ? "Редактировать цену" : "Новая цена"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Прайс-лист</InputLabel>
                <Select
                  value={current?.priceListId || ""}
                  onChange={e =>
                    setCurrent({ ...current, priceListId: e.target.value })
                  }
                >
                  {priceLists?.map(pl => (
                    <MenuItem key={pl.id} value={pl.id}>
                      {pl.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Категория заказчика</InputLabel>
                <Select
                  value={current?.categoryId || ""}
                  onChange={e =>
                    setCurrent({ ...current, categoryId: e.target.value })
                  }
                >
                  {categories?.map(cat => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Закупочная цена"
                type="number"
                fullWidth
                value={current?.purchasePrice || ""}
                onChange={e =>
                  setCurrent({
                    ...current,
                    purchasePrice: parseFloat(e.target.value),
                  })
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Розничная цена"
                type="number"
                fullWidth
                value={current?.retailPrice || ""}
                onChange={e =>
                  setCurrent({
                    ...current,
                    retailPrice: parseFloat(e.target.value),
                  })
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Оптовая цена"
                type="number"
                fullWidth
                value={current?.wholesalePrice || ""}
                onChange={e =>
                  setCurrent({
                    ...current,
                    wholesalePrice: parseFloat(e.target.value),
                  })
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Мин. наценка (%)"
                type="number"
                fullWidth
                value={current?.minMarkup || ""}
                onChange={e =>
                  setCurrent({ ...current, minMarkup: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Макс. скидка (%)"
                type="number"
                fullWidth
                value={current?.maxDiscount || ""}
                onChange={e =>
                  setCurrent({ ...current, maxDiscount: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Порог опта (шт)"
                type="number"
                fullWidth
                value={current?.bulkThreshold || ""}
                onChange={e =>
                  setCurrent({ ...current, bulkThreshold: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Цена при опте"
                type="number"
                fullWidth
                value={current?.bulkPrice || ""}
                onChange={e =>
                  setCurrent({
                    ...current,
                    bulkPrice: parseFloat(e.target.value),
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={handleSave} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
