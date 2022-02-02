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

export interface ShoppingCartDetail{
  amount: number;
  product: ShopProduct;
}

export interface ShoppingCartWithDetails{
    ownerUsername?: string;
    items: ShoppingCartDetail[];
    expireDate?: Date;
}

export const EMPTY_CART = {items: {}};
export const EMPTY_DETAILS_CART = {items: []};

export interface ShopProduct{
    id: string;
    name: string;
    price: number;
    description: string;
    types: string[];
    authors: Author[];
    inStock: number;
}
export interface ProfileInfo{
    username: string,
    email: string
}

export const EMPTY_PRODUCT_REQUEST: ShopProductRequest = {
    name: "",
    price: 0,
    description: "",
    types: [],
    authorsNames: [],
    inStock: 0
}

// export const EMPTY_PRODUCT: ShopProduct = {
//   name: "",
//   price: 0,
//   description: "",
//   types: [],
//   authors: [],
//   inStock: 0
// }

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

export const PAGE_SIZES: number[] = [10, 25, 50];

export const SORT_OPTION_DEFAULT: SortOption = {name: "Sortowanie: Trafność", code: "none"}

export function deepCopy<T>(source: T): T {
  return Array.isArray(source)
    ? source.map(item => deepCopy(item))
    : source instanceof Date
    ? new Date(source.getTime())
    : source && typeof source === 'object'
    ? Object.getOwnPropertyNames(source).reduce((o, prop) => {
        Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop)!);
        o[prop] = deepCopy((source as { [key: string]: any })[prop]);
        return o;
      }, Object.create(Object.getPrototypeOf(source)))
    : (source as T);
}