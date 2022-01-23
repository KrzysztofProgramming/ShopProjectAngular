export interface LoginRequest{
    usernameOrEmail: string,
    password: string
}

export interface CartProductRequest{
    productId: string;
    amount: number;
}

export interface SetCartRequest{
    products: {[key: string]: number};
}

export interface UpdatePasswordRequest{
    newPassword: string;
    oldPassword: string;
}

export interface RegisterRequest{
    username: string,
    email: string,
    password: string
}

export interface RefreshRequest{
    refreshToken: string;
}

export interface ShopProductRequest{
    id?: string;
    name: string;
    price: number;
    description: string;
    types: string[];
    authorsNames: string[];
    inStock: number;
}

export interface ShopProductRequestWithId extends ShopProductRequest{
  id: string;
}

export interface AuthorRequest{
  name: string, 
  description: string
}

export interface UpdateEmailRequest{
    newEmail: string;
    password: string;
}

export interface PageableParams{
    pageSize?: number,
    pageNumber?: number
}

export const DEFAULT_PAGEABLE: PageableParams = {pageSize: 25, pageNumber: 1};

export interface getAuthorsParams extends PageableParams{
  searchPhrase: string
}

export type SortType = "none" | "price_asc" | "price_desc" | "alphabetic_asc" | "alphabetic_desc";

export interface GetProductsParams extends PageableParams{
  searchPhrase?: string;
  minPrice?: number;
  maxPrice?: number;
  types?: string[];
  sort?: SortType;
  authorsNames?: string[];
  minInStock?: number;
  maxInStock?: number;
}

export const DEFAULT_PRODUCTS_PARAMS: GetProductsParams = {
  pageSize: DEFAULT_PAGEABLE.pageSize,
  pageNumber: DEFAULT_PAGEABLE.pageNumber,
  sort: "none",
  authorsNames: [],
} 

export interface TypeRequest{
  name: string;
}

