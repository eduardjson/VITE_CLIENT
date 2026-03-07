export interface CustomerCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PriceList {
  id: string;
  name: string;
  description?: string;
  validFrom: string;
  validTo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Price {
  id: string;
  productId: string;
  priceListId: string;
  categoryId: string;
  purchasePrice: number;
  retailPrice: number;
  wholesalePrice: number;
  minMarkup?: number;
  maxDiscount?: number;
  bulkThreshold?: number;
  bulkPrice?: number;
  createdAt: string;
  updatedAt: string;
  // populated fields (optional)
  product?: {
    id: string;
    title: string;
    manufacturer: string;
  };
  priceList?: PriceList;
  category?: CustomerCategory;
}

export interface PriceHistory {
  id: string;
  priceId: string;
  oldPurchasePrice?: number;
  oldRetailPrice?: number;
  oldWholesalePrice?: number;
  newPurchasePrice?: number;
  newRetailPrice?: number;
  newWholesalePrice?: number;
  changeReason?: string;
  changedAt: string;
  price?: Price;
}

export interface CreatePriceDto {
  productId: string;
  priceListId: string;
  categoryId: string;
  purchasePrice: number;
  retailPrice: number;
  wholesalePrice: number;
  minMarkup?: number;
  maxDiscount?: number;
  bulkThreshold?: number;
  bulkPrice?: number;
}

export interface UpdatePriceDto extends Partial<CreatePriceDto> {}
