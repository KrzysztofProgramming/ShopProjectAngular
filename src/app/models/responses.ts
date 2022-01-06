import { Author, ShopProductWithId, SimpleAuthor } from './models';

export interface LoginResponse{
    jwtToken?: string,
    refreshToken?: string
    error?: string
}

export interface ErrorResponse{
    info: string;
}

export interface GetByParamsResponse<T>{
    pageNumber: number;
    totalPages: number;
    totalElements: number;
    result: T[];
}

export interface TypesResponse{
  types: string[];
}

export interface TypeResponse{
  name: string;
}

export interface SimpleAuthorsResponse{
  simpleAuthors: SimpleAuthor[];
}

export type GetProductsResponse = GetByParamsResponse<ShopProductWithId>;
export type GetAuthorsResponse = GetByParamsResponse<Author>;
