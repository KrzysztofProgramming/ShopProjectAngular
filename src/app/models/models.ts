import { ShopProductRequest } from "./requests";

export interface JwtToken{
    authorities: number;
    exp: number;
    iat: number;
    roles: string[];
    sub: string;
}

export interface ShopUser{
}

export interface ShoppingCart{
    ownerUsername?: string;
    items: {
        [key: string] : number;
    }
    expireDate?: Date;
}

export interface ShopProduct extends ShopProductRequest{
    id?: string | null;
}

export interface ShopProductWithId extends ShopProduct{
    id: string;
}

export interface ProductsFilters{
    searchPhrase?: string;
    minPrice?: number;
    maxPrice?: number;
    types?: string[];
    minInStock?: number;
    maxInStock?: number;
}

export interface ProfileInfo{
    username: string,
    email: string
}

export const EMPTY_PRODUCT: ShopProduct = {
    name: "",
    price: 0,
    description: "",
    types: [],
    inStock: 0
}

export const productsTypes: string[] = [
    "Przygodowa",
    "Komedia",
    "Detektywistyczna",
    "Fantasy",
    "Fikcja historyczna",
    "Horror",
    "Romans",
    "Fikcja naukowa",
    "Thriller",
    "Biografia",
    "Sztuka",
    "Inna",
].sort();
