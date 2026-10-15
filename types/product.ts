import type { Catalog } from './catalog';
import type {
  ProductAttributeValue,
  ProductAttributeValueWithAttribute,
} from './attribute';

export interface Product {
  id: number;
  sku: string | null;
  title: string;
  slug: string | null;
  price: number | null;
  oldPrice: number | null;
  description: string | null;
  image: string | null;
  tag: string | null;
  subtitle: string | null;
  warranty: string | null;
  specs: string[];
  catalogId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: number;
  productId: number;
  url: string;
  alt: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface ProductWithImages extends Product {
  images: ProductImage[];
}

export interface ProductWithCatalog extends Product {
  catalog: Catalog;
}

export interface ProductWithAttributes extends Product {
  attributes: ProductAttributeValue[];
}

export interface ProductDetails extends Product {
  images: ProductImage[];
  catalog: Catalog;
  attributes: ProductAttributeValueWithAttribute[];
}

export interface CreateProductDto {
  sku?: string | null;
  title: string;
  slug?: string | null;
  price?: number | null;
  oldPrice?: number | null;
  description?: string | null;
  image?: string | null;
  tag?: string | null;
  subtitle?: string | null;
  warranty?: string | null;
  specs?: string[];
  catalogId: number;
}

export type UpdateProductDto = Partial<CreateProductDto>;

export interface CreateProductImageDto {
  url: string;
  alt?: string | null;
  sortOrder?: number;
}

export interface UpdateProductImageDto {
  url?: string;
  alt?: string | null;
  sortOrder?: number;
}

export interface ProductFormData {
  sku: string;
  title: string;
  slug: string;
  price: number | null;
  oldPrice: number | null;
  description: string;
  image: string;
  tag: string;
  subtitle: string;
  warranty: string;
  specs: string[];
  catalogId: number | null;
  images: CreateProductImageDto[];
  attributes: {
    attributeId: number;
    value: string;
  }[];
}
export interface CatalogProduct extends Product {
  catalog: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    parentId: number | null;
    createdAt: string;
    updatedAt: string;
  };

  images: ProductImage[];
}

export interface CatalogProductsResponse {
  items: CatalogProduct[];
  total: number;
  page: number;
  limit: number;
}
