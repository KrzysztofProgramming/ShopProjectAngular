import { ShopProductRequest } from './requests';

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
  id: string;
  name: string;
}

export interface ShoppingCart {
  ownerUsername?: string;
  items: {
    [key: string]: number;
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

export const EMPTY_CART = { items: {} };
export const EMPTY_DETAILS_CART = { items: [] };

export interface ShopProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  types: string[];
  authors: Author[];
  inStock: number;
}


export const EMPTY_PRODUCT_REQUEST: ShopProductRequest = {
  name: '',
  price: 0,
  description: '',
  types: [],
  authorsNames: [],
  inStock: 0,
};

export interface SortOption {
  name: string;
  code: string;
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

export interface CommonType{
  name: string;
  productsCount: number;
}

export const EMPTY_PROFILE_INFO: ProfileInfo = {
  username: "",
  email: "",
  info: EMPTY_USER_INFO
}

export class ShopOrderStatuses{
  static readonly PAID: number = 1;
  static readonly UNPAID: number = 0;
  static readonly CANCELLED: number = 2;
  static readonly UNKNOWN: number = -1;
}

export interface ShopOrder {
  id: string,
  ownerUsername: string,
  info: UserInfo,
  products: {[key: string]: number},
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

export const SORT_OPTION_DEFAULT: SortOption = {
  name: 'Sortowanie: Trafność',
  code: 'none',
};

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
        o[prop] = deepCopy((source as { [key: string]: any })[prop]);
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
