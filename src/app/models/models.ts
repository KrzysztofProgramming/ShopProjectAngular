import { TypeResponse } from './responses';
import { ProductsSortType, ShopProductRequest, OrdersSortType } from './requests';
import { Params } from '@angular/router';

export const serverUrl = "";

export interface JwtToken {
  authorities: number;
  exp: number;
  iat: number;
  sub: string;
}

export interface ShopUser {
  username: string;
  email: string;
  authorities: number;
  roles: string[];
  userInfo: UserInfo;
}

export interface Author extends SimpleAuthor {
  description: string;
  writtenBooks: number;
}

export interface SimpleAuthor {
  id: number;
  name: string;
}

export interface ShoppingCart {
  ownerUsername?: string;
  items: {
    [key: string]: number; //number id as string: amount
  };
  expireDate?: Date;
}

export interface ShoppingCartDetail {
  amount: number;
  product: ShopProduct;
}

export interface ShoppingCartWithDetails {
  ownerUsername?: string;
  items: ShoppingCartDetail[];
  expireDate?: Date;
}

export const EMPTY_CART = { items: {}};
export const EMPTY_DETAILS_CART = { items: [] };

export interface ShopProduct {
  id: number;
  name: string;
  price: number;
  description: string;
  types: TypeResponse[];
  authors: SimpleAuthor[];
  inStock: number;
  isArchived: boolean;
}

export interface ShopProductWithDetails extends ShopProduct{
  isDeletable?: boolean;
}

export const EMPTY_PRODUCT_REQUEST: ShopProductRequest = {
  name: '',
  price: 0,
  description: '',
  types: [],
  authors: [],
  inStock: 0,
};

export interface SortOption {
  name: string;
  code: ProductsSortType;
}

export interface Role {
  name: string;
  authorities: number;
  order: number;
}

export interface Address {
  street: string;
  houseNumber: number;
  localNumber?: number;
  city: string;
  zipCode: number;
}

export const EMPTY_ADDRESS: Address = {
  street: '',
  houseNumber: 0,
  localNumber: 0,
  city: '',
  zipCode: 0,
};

export interface UserInfo {
  firstname: string;
  lastname: string;
  phoneNumber: number;
  address: Address;
}

export const EMPTY_USER_INFO: UserInfo = {
  firstname: '',
  lastname: '',
  phoneNumber: 0,
  address: EMPTY_ADDRESS,
};

export interface ProfileInfo {
  username: string;
  email: string;
  info?: UserInfo;
}

export interface CommonType extends TypeResponse{
  productsCount: number;
}

export const EMPTY_PROFILE_INFO: ProfileInfo = {
  username: "",
  email: "",
  info: EMPTY_USER_INFO
}

export class OrderStatuses{
  static readonly PAID: number = 1;
  static readonly UNPAID: number = 0;
  static readonly CANCELLED: number = 2;
  static readonly UNKNOWN: number = -1;
}

export interface ShopOrder {
  id: number,
  ownerUsername: string,
  email: string;
  info: UserInfo,
  productsIds: {[key: string]: number},
  issuedDate: Date,
  totalPrice: number;
  status: number;
}

export const SORT_OPTIONS: SortOption[] = [
  { name: 'Sortowanie: Trafność', code: 'none' },
  { name: 'Cena: rosnąco', code: 'price_asc' },
  { name: 'Cena: malejąco', code: 'price_desc' },
  { name: 'Alfabetycznie: A-Z', code: 'alphabetic_asc' },
  { name: 'Alfabatycznie: Z-A', code: 'alphabetic_desc' },
];

export const SORT_OPTIONS_ADMIN: SortOption[] = [
  ...SORT_OPTIONS,
  {name: "Dostępność: rosnąco", code: 'in_stock_asc'},
  {name: "Dostępność: malejąco", code: 'in_stock_desc'},
  {name: "Id: rosnąco", code: 'id_asc'},
  {name: "Id: malejąco", code: 'id_desc'}
]

export const SORT_OPTION_DEFAULT: SortOption = {
  name: 'Sortowanie: Trafność',
  code: 'none',
};

export interface OrdersSortOption{
  name: string,
  code: OrdersSortType
}

export const ORDERS_SORT_OPTIONS: OrdersSortOption[] = [
  {name: "Od najnowszych", code: 'date_desc'},
  {name: "Od najstarszych", code: 'date_asc'},
  {name: "Cena: rosnąco", code: "price_asc"},
  {name: "Cena: malejąco", code: 'price_desc'}
]

export interface OrdersStatusOption{
  name: string, 
  code?: number;
}

export const ORDERS_STATUS_OPTIONS: OrdersStatusOption[] = [
  {name: "Dowolny", code: undefined},
  {name: "Zapłacone", code: OrderStatuses.PAID},
  {name: "Niezapłacone", code: OrderStatuses.UNPAID},
  {name: "Anulowane", code: OrderStatuses.CANCELLED}
]

export type AuthorsSortType = 'alph_asc' | 'alph_desc' | 'books_asc' | 'books_desc'

export interface AuthorsSortOption{
  name: string;
  code: AuthorsSortType;
}

export const AUTHORS_SORT_OPTIONS: AuthorsSortOption[] = [
  {name: "Alfabetycznie: A-Z", code: 'alph_asc'},
  {name: "Alfabetycznie: Z-A", code: 'alph_desc'},
  {name: "Książki: rosnąco", code: "books_asc"},
  {name: "Książki: malejąco", code: "books_desc"}
]

export type TypesSortType = AuthorsSortType;

export interface TypesSortOption{
  name: string;
  code: TypesSortType
}

export const TYPES_SORT_OPTIONS = AUTHORS_SORT_OPTIONS;

export function getStatusString(value: number){
  return value === OrderStatuses.CANCELLED ? "Anulowany" :
  value === OrderStatuses.PAID ? "Zapłacone" :
  value === OrderStatuses.UNPAID ? "Niezapłacone" :
  "Nieznany"
}

export interface ArchivedOption{
  name: string,
  code: number;
}

export const ARCHIVED_ALL: number = -1;
export const ARCHIVED_ARCHIVED: number = 1;
export const ARCHIVED_AVAILABLE: number = 0; 

export const ARCHIVED_OPTIONS: ArchivedOption[] = [
  {name: "Wszystkie", code: ARCHIVED_ALL},
  {name: "Dostępne", code: ARCHIVED_AVAILABLE},
  {name: "Zarchiwizowane", code: ARCHIVED_ARCHIVED}
]

export function clearDefaultParamsValues(params: Params, defaultParams: Params): void{
  Object.keys(defaultParams).forEach(key=>{
    if(params[key] === defaultParams[key]) params[key] = undefined;
  });
}

export function deepCopy<T>(source: T): T {
  return Array.isArray(source)
    ? source.map((item) => deepCopy(item))
    : source instanceof Date
    ? new Date(source.getTime())
    : source && typeof source === 'object'
    ? Object.getOwnPropertyNames(source).reduce((o, prop) => {
        Object.defineProperty(
          o,
          prop,
          Object.getOwnPropertyDescriptor(source, prop)!
        );
        o[prop] = deepCopy((source as unknown as { [key: string]: any })[prop]);
        return o;
      }, Object.create(Object.getPrototypeOf(source)))
    : (source as T);
}

export const flattenObject = (obj: { [key: string]: any }) => {
  const flattened: { [key: string]: any } = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value));
    } else {
      flattened[key] = value;
    }
  });

  return flattened;
};
