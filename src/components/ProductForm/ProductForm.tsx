import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRef } from "react";

import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

import { AddAPhoto } from "@mui/icons-material";

import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../../services";
import { ProductFormSchema, productSchema } from "./product.schema";
import { readImageAsBase64 } from "./utils";
import { CreateProductDTO, UpdateProductDTO } from "../../dto";

type ProductFormProps = {
  product?: any;
  onClose: () => void;
  mode: "create" | "update";
};

const ProductForm = ({ product, onClose, mode }: ProductFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProductFormSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: product || {},
  });

  const {
    title,
    description,
    price,
    quantity,
    category,
    manufacturer,
    imageUrl,
  } = watch();

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const isLoading = isCreating || isUpdating;
  const isCreateMode = mode === "create";
  const submit = isCreateMode ? createProduct : updateProduct;

  const submitHandler = async (data: UpdateProductDTO | CreateProductDTO) => {
    await submit({ data, id: product?.id })
      .unwrap()
      .then(() => {
        reset();
        onClose();
      })
      .catch(err => console.error("Ошибка при создании продукта:", err));
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.item(0);
    if (!file) return;

    const result = await readImageAsBase64(file);
    setValue("imageUrl", result);
  };

  const formTitle = isCreateMode
    ? "Добавление продукта"
    : "Редактирование продукта";

  const actionName = isCreateMode ? "Добавить продукт" : "Обновить продукт";

  return (
    <div className="flex flex-col p-5 gap-4 min-w-100 max-w-200 border-blue-100 border rounded-sm">
      <Typography variant="h6">{formTitle}</Typography>
      <div className="flex flex-col gap-4 w-full">
        <TextField
          fullWidth
          label="Наименование"
          type="text"
          value={title}
          onChange={event => setValue("title", event.target.value)}
          error={!!errors.title}
          helperText={errors.title?.message}
        />
        <TextField
          fullWidth
          label="Описание"
          type="text"
          value={description}
          onChange={event => setValue("description", event.target.value)}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
        <TextField
          fullWidth
          label="Цена"
          type="number"
          value={price}
          onChange={event => setValue("price", Number(event.target.value))}
          error={!!errors.price}
          helperText={errors.price?.message}
        />
        <TextField
          fullWidth
          label="Количество"
          type="number"
          value={quantity}
          onChange={e =>
            e.target.value ? setValue("quantity", Number(e.target.value)) : ""
          }
          error={!!errors.quantity}
          helperText={errors.quantity?.message}
        />
        <TextField
          fullWidth
          label="Категория"
          type="text"
          value={category}
          onChange={event => setValue("category", event.target.value)}
          error={!!errors.category}
          helperText={errors.category?.message}
        />
        <TextField
          fullWidth
          label="Производитель"
          type="text"
          value={manufacturer}
          onChange={event => setValue("manufacturer", event.target.value)}
          error={!!errors.manufacturer}
          helperText={errors.manufacturer?.message}
        />
        <Box className="flex flex-row gap-2">
          <Button
            variant="contained"
            color="success"
            startIcon={<AddAPhoto />}
            onClick={() => fileInputRef.current?.click()}
          >
            Выберите изображение
          </Button>
          {imageUrl && (
            <img src={imageUrl} width={36} height={36} className="rounded-sm" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            ref={fileInputRef}
          />
        </Box>
        <div className="flex flex-row justify-end gap-2">
          <Button onClick={onClose}>Выйти</Button>
          <Button
            type="submit"
            onClick={handleSubmit(submitHandler)}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : actionName}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
