import { useGetAllProductsQuery } from "../services/productsApi";
import { useNavigate } from "@tanstack/react-router";
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import {
  LinearProgress,
  Box,
  Button,
  Tooltip,
  Typography,
} from "@mui/material";
import { ProductDTO } from "../dto";
import { Add } from "@mui/icons-material";
import ProductFilter from "./ProductFilter";
import { useAppSelector } from "../store/hooks";
import { selectFilteredProducts } from "../services/selectors/productSelectors";

const ProductList = () => {
  const navigate = useNavigate({ from: "/products" });
  const { isLoading } = useGetAllProductsQuery();

  // Используем мемоизированный селектор для получения отфильтрованных продуктов
  const filteredProducts = useAppSelector(selectFilteredProducts);

  const handleOpen: GridEventListener<"rowClick"> = ({ id }) => {
    navigate({ to: `/products/${id}` });
  };

  const columns: GridColDef<ProductDTO>[] = [
    {
      field: "title",
      headerName: "Наименование",
      editable: false,
      minWidth: 140,
      flex: 1,
    },
    {
      field: "category",
      headerName: "Категория",
      editable: false,
      minWidth: 140,
      flex: 1,
    },
    {
      field: "manufacturer",
      headerName: "Производитель",
      editable: false,
      minWidth: 140,
      flex: 1,
    },
    {
      field: "imageUrl",
      headerName: "",
      minWidth: 100,
      flex: 1,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
          {row?.imageUrl && (
            <img
              src={row.imageUrl}
              width={36}
              height={36}
              style={{ borderRadius: "4px" }}
              alt={row.title}
            />
          )}
        </Box>
      ),
    },
    {
      field: "price",
      headerName: "Стоимость",
      editable: false,
      minWidth: 140,
      valueFormatter: params => {
        return `${params.value} ₽`;
      },
    },
    {
      field: "quantity",
      headerName: "Остаток",
      editable: false,
      minWidth: 140,
    },
  ];

  return (
    <Box sx={{ height: "100%", width: "100%", p: 2 }}>
      {isLoading && <LinearProgress />}

      <ProductFilter />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">Список товаров</Typography>
        <Tooltip title="Добавьте позицию в номенклатуру">
          <Button
            onClick={() => navigate({ to: "/products/add" })}
            variant="contained"
            startIcon={<Add />}
          >
            Добавить товар
          </Button>
        </Tooltip>
      </Box>

      {filteredProducts && (
        <DataGrid
          sx={{
            height: "calc(100vh - 250px)",
            ".MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-row:hover": {
              cursor: "pointer",
            },
          }}
          rows={filteredProducts}
          columns={columns}
          onRowClick={handleOpen}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
        />
      )}
    </Box>
  );
};

export default ProductList;
