import { ProductsFilters } from "./models";

export interface LoginRequest{
    usernameOrEmail: string,
    password: string
}

export interface SetCartProductRequest{
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
    name: string;
    price: number;
    description: string;
    types: string[];
    inStock: number;
}

export interface UpdateProfileRequest{
    email: string;
}

export interface PageableParams{
    pageSize?: number,
    pageNumber?: number
}

export interface GetProductsParams extends PageableParams, ProductsFilters{
}

