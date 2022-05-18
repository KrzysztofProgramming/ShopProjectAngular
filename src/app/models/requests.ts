import { UserInfo, AuthorsSortOption, AuthorsSortType, ARCHIVED_AVAILABLE } from './models';
import { Params } from '@angular/router';

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface CartProductRequest {
  productId: number;
  amount: number;
}

export interface SetCartRequest {
  products: { [key: number]: number };
}

export interface UpdatePasswordRequest {
  newPassword: string;
  oldPassword: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface ShopProductRequest {
  id?: number;
  name: string;
  price: number;
  description: string;
  types: number[];
  authors: number[];
  inStock: number;
}

export interface ShopProductRequestWithId extends ShopProductRequest {
  id: number;
}

export interface AuthorRequest {
  name: string;
  description: string;
}

export interface UpdateEmailRequest {
  newEmail: string;
  password: string;
}

export interface PageableParams extends Params {
  pageSize?: number;
  pageNumber?: number;
}

export const DEFAULT_PAGEABLE: PageableParams = { pageSize: 20, pageNumber: 1 };

export const PAGE_SIZES: number[] = [10, 20, 35, 50];

export interface GetAuthorsParams extends PageableParams {
  searchPhrase?: string;
  minBooks?: number;
  maxBooks?: number;
  sort?: AuthorsSortType;
}

export const DEFAULT_AUTHORS_PARAMS: GetAuthorsParams = {
  pageSize: DEFAULT_PAGEABLE.pageSize,
  pageNumber: DEFAULT_PAGEABLE.pageNumber,
  sort: 'alph_asc'
};

export type ProductsSortType =
  | 'none'
  | 'price_asc'
  | 'price_desc'
  | 'alphabetic_asc'
  | 'alphabetic_desc'
  | 'in_stock_asc'
  | 'in_stock_desc'
  | 'id_asc'
  | 'id_desc'

export interface GetProductsParams extends PageableParams {
  searchPhrase?: string;
  minPrice?: number;
  maxPrice?: number;
  types?: number[];
  sort?: ProductsSortType;
  authors?: number[];
  minInStock?: number;
  maxInStock?: number;
  isArchived?: number;
}

export const DEFAULT_PRODUCTS_PARAMS: GetProductsParams = {
  pageSize: DEFAULT_PAGEABLE.pageSize,
  pageNumber: DEFAULT_PAGEABLE.pageNumber,
  sort: 'none',
  authors: [],
  isArchived: ARCHIVED_AVAILABLE
};

export interface TypeRequest {
  name: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface CheckResetTokenRequest {
  token: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface NewOrderRequest {
  email: string;
  info: UserInfo;
  products: { [key: number]: number }; //id: amount
}

export interface PayOrderRequest {
  id: number;
}

export type OrdersSortType = 
  | 'price_asc'
  | 'price_desc'
  | 'date_asc'
  | 'date_desc';


export interface GetOrdersParams extends PageableParams {
  maxPrice?: number;
  minPrice?: number;
  maxDate?: string; //yyyy-MM-dd
  minDate?: string;
  status?: number;
  sort?: OrdersSortType;
}


export const DEFAULT_ORDERS_PARAMS: GetOrdersParams = {
  pageSize: DEFAULT_PAGEABLE.pageSize,
  pageNumber: DEFAULT_PAGEABLE.pageNumber,
  sort: 'date_desc'
} 

export interface GetTypesParams extends PageableParams {
  minProducts?: number;
  maxProducts?: number;
  searchPhrase?: string;
  sort?: string;
}

export const DEFAULT_TYPES_PARAMS: GetTypesParams = {
  pageSize: DEFAULT_PAGEABLE.pageSize,
  pageNumber: DEFAULT_PAGEABLE.pageNumber,
  sort: 'alph_asc'
};

export interface ArchiveRequest{
  archive: boolean;
}
