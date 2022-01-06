
export interface LoginRequest{
    usernameOrEmail: string,
    password: string
}

export interface CartProductRequest{
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
    authors: AuthorRequest[];
    inStock: number;
}

export interface AuthorRequest{
  name: string, 
  description: string
}

export interface UpdateProfileRequest{
    email: string;
}

export interface PageableParams{
    pageSize?: number,
    pageNumber?: number
}

export const DEFAULT_PAGEABLE: PageableParams = {pageSize: 25, pageNumber: 1};

export interface getAuthorsParams extends PageableParams{
  searchPhrase: string
}

export interface GetProductsParams extends PageableParams{
  searchPhrase?: string;
  minPrice?: number;
  maxPrice?: number;
  types?: string[];
  sort?: string;
  authorsNames?: string[];
  minInStock?: number;
  maxInStock?: number;
}

export interface TypeRequest{
  name: string;
}

