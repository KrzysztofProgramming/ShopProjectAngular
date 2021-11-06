import { ShopProductWithId } from './models';

export interface LoginResponse{
    jwtToken?: string,
    refreshToken?: string
    error?: string
}

export interface ErrorResponse{
    info: string;
}

export interface GetProductsResponse{
    pageNumber: number;
    totalPages: number;
    totalElements: number;
    products: ShopProductWithId[];
}