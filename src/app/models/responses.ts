import { Author, Role, ShopProduct, SimpleAuthor, ShopUser, ShopOrder, CommonType } from './models';

export interface LoginResponse {
  jwtToken?: string;
  refreshToken?: string;
  error?: ErrorResponse;
  roles?: Role[];
}

export interface ErrorResponse {
  info: string;
}

export interface GetByParamsResponse<T> {
  pageNumber: number;
  totalPages: number;
  totalElements: number;
  result: T[];
}

export interface TypesResponse {
  types: string[];
}

export interface TypeResponse {
  name: string;
}

export interface SimpleAuthorsResponse {
  simpleAuthors: SimpleAuthor[];
}

export type GetProductsResponse = GetByParamsResponse<ShopProduct>;
export type GetAuthorsResponse = GetByParamsResponse<Author>;
export type GetUsersResponse = GetByParamsResponse<ShopUser>;
export type GetOrdersResponse = GetByParamsResponse<ShopOrder>;
export type GetTypesResponse = GetByParamsResponse<CommonType>;
