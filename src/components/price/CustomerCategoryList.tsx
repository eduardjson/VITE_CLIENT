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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Box,
  Typography,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../services/priceApi";

export const CustomerCategoryList = () => {
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<{
    id?: string;
    name: string;
    code: string;
    description?: string;
  }>({
    name: "",
    code: "",
    description: "",
  });

  const handleOpen = (cat?: any) => {
    if (cat)
      setCurrent({
        id: cat.id,
        name: cat.name,
        code: cat.code,
        description: cat.description,
      });
    else setCurrent({ name: "", code: "", description: "" });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    if (current.id) {
      await updateCategory({
        id: current.id,
        body: {
          name: current.name,
          code: current.code,
          description: current.description,
        },
      });
    } else {
      await createCategory({
        name: current.name,
        code: current.code,
        description: current.description,
      });
    }
    handleClose();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Удалить категорию?")) await deleteCategory(id);
  };

  if (isLoading) return <Typography>Загрузка...</Typography>;

  return (
    <Box>
      <Button
        startIcon={<Add />}
        variant="contained"
        onClick={() => handleOpen()}
      >
        Новая категория
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>Код</TableCell>
              <TableCell>Описание</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories?.map(cat => (
              <TableRow key={cat.id}>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.code}</TableCell>
                <TableCell>{cat.description}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(cat)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(cat.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {current.id ? "Редактировать" : "Новая категория"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Название"
            fullWidth
            margin="dense"
            value={current.name}
            onChange={e => setCurrent({ ...current, name: e.target.value })}
          />
          <TextField
            label="Код"
            fullWidth
            margin="dense"
            value={current.code}
            onChange={e => setCurrent({ ...current, code: e.target.value })}
          />
          <TextField
            label="Описание"
            fullWidth
            margin="dense"
            multiline
            rows={2}
            value={current.description}
            onChange={e =>
              setCurrent({ ...current, description: e.target.value })
            }
          />
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
