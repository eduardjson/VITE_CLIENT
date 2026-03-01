import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";

import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
  Avatar,
} from "@mui/material";

import { AddAPhoto } from "@mui/icons-material";

import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useAddImagesMutation,
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
  const [addImages, { isLoading: isUploadingImages }] = useAddImagesMutation();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<
    { id: string; url: string }[]
  >([]);

  const isLoading = isCreating || isUpdating || isUploadingImages;
  const isCreateMode = mode === "create";
  const submit = isCreateMode ? createProduct : updateProduct;

  const submitHandler = async (data: UpdateProductDTO | CreateProductDTO) => {
    try {
      const result = await submit({ data, id: product?.id } as any).unwrap();

      // if create mode, result is new product id
      const productId = product?.id ?? result?.id ?? (result as any);

      // загрузка изображений, если выбраны файлы
      if (selectedFiles.length > 0 && productId) {
        const formData = new FormData();
        selectedFiles.forEach(f => formData.append("images", f));
        const uploadRes = await addImages({
          id: productId,
          images: selectedFiles,
        } as any).unwrap();
        // обновим локальные превью изображений если нужно
        if (uploadRes?.images) {
          setUploadedImages(uploadRes.images);
        }
      }

      reset();
      onClose();
    } catch (err) {
      console.error("Ошибка при сохранении продукта:", err);
    }
  };

  const handleFileSelect2 = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.item(0);
    if (!file) return;

    const result = await readImageAsBase64(file);
    setValue("imageUrl", result);
  };

  // обработчик выбора файлов
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    // сохраняем в состояние
    setSelectedFiles(prev => [...prev, ...files].slice(0, 20)); // максимум 20
    // показываем превью для первых файлов
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // превью существующих/предыдущих изображений
  const previewImages = [...uploadedImages];
  if (imageUrl) {
    // если есть основное изображение, можно добавить как превью
    previewImages.unshift({ id: "local-main", url: imageUrl });
  }

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
          onChange={e => setValue("title", e.target.value)}
          error={!!errors.title}
          helperText={errors.title?.message}
        />
        <TextField
          fullWidth
          label="Описание"
          type="text"
          value={description}
          onChange={e => setValue("description", e.target.value)}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
        <TextField
          fullWidth
          label="Цена"
          type="number"
          value={price}
          onChange={e => setValue("price", Number(e.target.value))}
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
          onChange={e => setValue("category", e.target.value)}
          error={!!errors.category}
          helperText={errors.category?.message}
        />
        <TextField
          fullWidth
          label="Производитель"
          type="text"
          value={manufacturer}
          onChange={e => setValue("manufacturer", e.target.value)}
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
            onChange={handleFileSelect2}
            ref={fileInputRef}
          />
        </Box>
        <Box className="flex flex-row gap-2 items-center">
          <Button
            variant="contained"
            color="success"
            startIcon={<AddAPhoto />}
            onClick={() => fileInputRef.current?.click()}
          >
            Выберите изображения
          </Button>
          {selectedFiles.length > 0 && (
            <span>{selectedFiles.length} файла(ов) выбрано</span>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
        </Box>

        {selectedFiles.length > 0 && (
          <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
            {selectedFiles.map((f, idx) => (
              <Box
                key={idx}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Avatar
                  variant="rounded"
                  src={URL.createObjectURL(f)}
                  sx={{ width: 72, height: 72 }}
                />
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => removeSelectedFile(idx)}
                >
                  Удалить
                </Button>
              </Box>
            ))}
          </Box>
        )}

        <Box display="flex" gap={2} flexWrap="wrap">
          {previewImages.map(img => (
            <Box
              key={img.id}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <img
                src={img.url}
                alt="preview"
                width={72}
                height={72}
                style={{ objectFit: "cover" }}
              />
            </Box>
          ))}
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
