
export interface Catalog {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  description: string | null;
  image: string | null;
  count: number;
  children?: Catalog[];
}

export interface CatalogTree extends Catalog {
  children: CatalogTree[];
}

export interface CatalogWithProducts extends Catalog {
  products: import('./product').Product[];
}

export interface CatalogWithAttributes extends Catalog {
  attributes: import('./attribute').CatalogAttribute[];
}

export interface CreateCatalogDto {
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parentId?: number | null;
}

export type UpdateCatalogDto = Partial<CreateCatalogDto>;

export interface CatalogFormData {
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId: number | null;
}

export interface CatalogWithCount extends Catalog {
  count: number;
  parent: Catalog | null;
  children: Catalog[];
}
