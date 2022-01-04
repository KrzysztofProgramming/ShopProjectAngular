import { ShopProductRequest } from "./requests";

export interface JwtToken{
    authorities: number;
    exp: number;
    iat: number;
    sub: string;
}

export interface ShopUser{
}

export interface Author extends SimpleAuthor{
  description: string,
}

export interface SimpleAuthor{
  id: string,
  name: string
}

export interface ShoppingCart{
    ownerUsername?: string;
    items: {
        [key: string] : number;
    }
    expireDate?: Date;
}

export const EMPTY_CART = {items: {}};

export interface ShopProduct extends ShopProductRequest{
    id?: string | null;
}

export interface ShopProductWithId extends ShopProduct{
    id: string;
}

export interface ProductsFilters{
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
    authors: [],
    inStock: 0
}

export interface SortOption{
  name: string,
  code: string
}

export const SORT_OPTIONS: SortOption[] = [
  {name: "Sortowanie: Trafność", code: "none"},
  {name: "Cena: rosnąco", code: "price_asc"},
  {name: "Cena: malejąco", code: "price_desc"},
  {name: "Alfabetycznie: A-Z", code: "alphabetic_asc"},
  {name: "Alfabatycznie: Z-A", code: "alphabetic_desc"}
]
