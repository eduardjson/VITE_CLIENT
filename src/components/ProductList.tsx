import { useGetAllProductsQuery } from "../services";
import { useNavigate } from "@tanstack/react-router";

import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";

import { LinearProgress, Box, Button, Tooltip } from "@mui/material";
import { ProductDTO } from "../dto";
import { Add } from "@mui/icons-material";

const ProductList = () => {
  const navigate = useNavigate({ from: "/products" });
  const { data: products = [], isLoading } = useGetAllProductsQuery();

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
        <div className="flex flex-row align-middle p-2">
          {row?.imageUrl && (
            <img
              src={row.imageUrl}
              width={36}
              height={36}
              className="rounded-sm"
            />
          )}
        </div>
      ),
    },
    {
      field: "price",
      headerName: "Стоимость",
      editable: false,
      minWidth: 140,
    },
    {
      field: "quantity",
      headerName: "Остаток",
      editable: false,
      minWidth: 140,
    },
  ];

  return (
    <Box
      sx={{ height: "100%", width: "100%", paddingBottom: "100px" }}
      className="grid grid-col gap-2"
    >
      {isLoading && <LinearProgress />}
      <Tooltip title="Добавьте позицию в номенклатуру">
        <Button
          onClick={() => navigate({ to: "/products/add" })}
          className="w-fit"
          sx={{ px: 1 }}
        >
          <Add />
        </Button>
      </Tooltip>
      {products && (
        <DataGrid
          sx={{
            ".MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-row:hover": {
              cursor: "pointer",
            },
          }}
          rows={products}
          columns={columns}
          onRowClick={handleOpen}
          disableRowSelectionOnClick
          disableColumnSorting
          disableColumnFilter
          disableVirtualization
        />
      )}
    </Box>
  );
};

export default ProductList;
