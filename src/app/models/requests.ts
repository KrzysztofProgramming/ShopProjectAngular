import { UserInfo, ShoppingCart } from './models';
import { Params } from '@angular/router';

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface CartProductRequest {
  productId: string;
  amount: number;
}

export interface SetCartRequest {
  products: { [key: string]: number };
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
  id?: string;
  name: string;
  price: number;
  description: string;
  types: string[];
  authorsNames: string[];
  inStock: number;
}

export interface ShopProductRequestWithId extends ShopProductRequest {
  id: string;
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
}

export const DEFAULT_AUTHORS_PARAMS = DEFAULT_PAGEABLE;

export type ProductsSortType =
  | 'none'
  | 'price_asc'
  | 'price_desc'
  | 'alphabetic_asc'
  | 'alphabetic_desc';

export interface GetProductsParams extends PageableParams {
  searchPhrase?: string;
  minPrice?: number;
  maxPrice?: number;
  types?: string[];
  sort?: ProductsSortType;
  authorsNames?: string[];
  minInStock?: number;
  maxInStock?: number;
}

export const DEFAULT_PRODUCTS_PARAMS: GetProductsParams = {
  pageSize: DEFAULT_PAGEABLE.pageSize,
  pageNumber: DEFAULT_PAGEABLE.pageNumber,
  sort: 'none',
  authorsNames: [],
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
  products: { [key: string]: number };
}

export interface PayOrderRequest {
  id: string;
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
}
