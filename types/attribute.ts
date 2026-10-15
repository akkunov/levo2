import type { AttributeType } from './enums';

export interface Attribute {
  id: number;
  name: string;
  slug: string;
  type: AttributeType;
  description: string | null;
  options: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CatalogAttribute {
  id: number;
  catalogId: number;
  attributeId: number;
  required: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogAttributeWithAttribute extends CatalogAttribute {
  attribute: Attribute;
}

export interface ProductAttributeValue {
  id: number;
  productId: number;
  attributeId: number;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductAttributeValueWithAttribute
  extends ProductAttributeValue {
  attribute: Attribute;
}

export interface CreateAttributeDto {
  name: string;
  slug: string;
  type: AttributeType;
  description?: string | null;
  options?: string[];
}

export type UpdateAttributeDto = Partial<CreateAttributeDto>;

export interface CreateCatalogAttributeDto {
  catalogId: number;
  attributeId: number;
  required?: boolean;
}

export interface SetProductAttributeValueDto {
  attributeId: number;
  value: string;
}

export interface AttributeFormData {
  name: string;
  slug: string;
  type: AttributeType;
  description: string;
  options: string[];
}

export interface ProductAttributeFormData {
  attributeId: number;
  value: string;
}