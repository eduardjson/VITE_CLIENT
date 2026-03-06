import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { ProductDTO } from "../../dto";

// Базовые селекторы
const selectAllProducts = (state: RootState) => {
  const productsApi = (state as any).productsApi;
  return (
    (productsApi?.queries?.["getAllProducts(undefined)"]
      ?.data as ProductDTO[]) || []
  );
};

const selectFilterState = (state: RootState) => state.filter;

// Мемоизированный селектор для получения уникальных производителей
export const selectUniqueManufacturers = createSelector(
  [selectAllProducts],
  products => {
    const manufacturers = products
      .map(product => product.manufacturer)
      .filter((value, index, self) => value && self.indexOf(value) === index)
      .sort();
    return manufacturers;
  },
);

// Мемоизированный селектор для фильтрации продуктов
export const selectFilteredProducts = createSelector(
  [selectAllProducts, selectFilterState],
  (products, filter) => {
    return products.filter(product => {
      // Фильтр по названию
      const matchesSearch =
        filter.searchQuery === "" ||
        product.title.toLowerCase().includes(filter.searchQuery.toLowerCase());

      // Фильтр по производителю
      const matchesManufacturer =
        filter.manufacturer === "" ||
        product.manufacturer === filter.manufacturer;

      // Фильтр по минимальной цене
      const matchesMinPrice =
        filter.minPrice === null || product.price >= filter.minPrice;

      // Фильтр по максимальной цене
      const matchesMaxPrice =
        filter.maxPrice === null || product.price <= filter.maxPrice;

      return (
        matchesSearch &&
        matchesManufacturer &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });
  },
);

// Мемоизированный селектор для получения статистики по отфильтрованным продуктам
export const selectFilterStats = createSelector(
  [selectFilteredProducts],
  filteredProducts => ({
    totalCount: filteredProducts.length,
    averagePrice:
      filteredProducts.length > 0
        ? Math.round(
            filteredProducts.reduce((sum, p) => sum + p.price, 0) /
              filteredProducts.length,
          )
        : 0,
    totalQuantity: filteredProducts.reduce(
      (sum, p) => sum + (p.quantity || 0),
      0,
    ),
  }),
);
