import { ShopProductRequest } from "./requests";

export interface JwtToken{
    authorities: number;
    exp: number;
    iat: number;
    roles: string[];
    sub: string;
}

export interface ShopProduct extends ShopProductRequest{
    id?: string | null;
    // name: string;
    // price: number;
    // description: string;
    // types: string[];
}

export interface ShopProductWithId extends ShopProduct{
    id: string;
}


export interface ProductsFilters{
    searchPhrase?: string;
    minPrice?: number;
    maxPrice?: number;
    types?: string[];
  }

export const EMPTY_PRODUCT: ShopProduct = {
    name: "",
    price: 0,
    description: "",
    types: []
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
