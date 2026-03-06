import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Grid,
  Typography,
  Slider,
  Chip,
} from "@mui/material";
import { Search, Clear, FilterList } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setSearchQuery,
  setManufacturer,
  setMinPrice,
  setMaxPrice,
  resetFilters,
} from "../services/slices/filterSlice";
import {
  selectUniqueManufacturers,
  selectFilterStats,
} from "../services/selectors/productSelectors";
import debounce from "lodash/debounce";

const ProductFilter: React.FC = () => {
  const dispatch = useAppDispatch();
  const manufacturers = useAppSelector(selectUniqueManufacturers);
  const stats = useAppSelector(selectFilterStats);

  // Локальное состояние для мгновенного обновления UI
  const [localSearch, setLocalSearch] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

  // Дебаунс для поиска
  const debouncedSearch = React.useMemo(
    () =>
      debounce((value: string) => {
        dispatch(setSearchQuery(value));
      }, 300),
    [dispatch],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLocalSearch(value);
    debouncedSearch(value);
  };

  const handleManufacturerChange = (event: any) => {
    dispatch(setManufacturer(event.target.value));
  };

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    const range = newValue as [number, number];
    setPriceRange(range);
    dispatch(setMinPrice(range[0]));
    dispatch(setMaxPrice(range[1]));
  };

  const handleReset = () => {
    setLocalSearch("");
    setPriceRange([0, 100000]);
    dispatch(resetFilters());
  };

  const hasActiveFilters = () => {
    return localSearch !== "" || priceRange[0] > 0 || priceRange[1] < 100000;
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <FilterList sx={{ mr: 1 }} color="primary" />
        <Typography variant="h6">Фильтры товаров</Typography>
        {hasActiveFilters() && (
          <Chip
            label={`Найдено: ${stats.totalCount}`}
            color="primary"
            size="small"
            sx={{ ml: 2 }}
          />
        )}
      </Box>

      <Grid container spacing={2}>
        {/* Поиск по названию */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Поиск по названию"
            value={localSearch}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: "action.active" }} />,
            }}
            size="small"
          />
        </Grid>

        {/* Фильтр по производителю */}
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Производитель</InputLabel>
            <Select
              value={useAppSelector(state => state.filter.manufacturer)}
              label="Производитель"
              onChange={handleManufacturerChange}
            >
              <MenuItem value="">Все производители</MenuItem>
              {manufacturers.map(manufacturer => (
                <MenuItem key={manufacturer} value={manufacturer}>
                  {manufacturer}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Фильтр по цене */}
        <Grid item xs={12} md={4}>
          <Box sx={{ px: 2 }}>
            <Typography gutterBottom>Цена</Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={100000}
              step={1000}
              valueLabelFormat={value => `${value} ₽`}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="caption">{priceRange[0]} ₽</Typography>
              <Typography variant="caption">{priceRange[1]} ₽</Typography>
            </Box>
          </Box>
        </Grid>

        {/* Кнопка сброса */}
        <Grid item xs={12} md={1}>
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={handleReset}
            startIcon={<Clear />}
            sx={{ height: "100%" }}
          >
            Сброс
          </Button>
        </Grid>
      </Grid>

      {/* Статистика фильтрации */}
      {hasActiveFilters() && (
        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Средняя цена: {stats.averagePrice} ₽
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Общий остаток: {stats.totalQuantity} шт.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ProductFilter;
