import { ShopProduct } from './../../models/models';
import { environment } from './../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { ProductsService } from './products.service';
import { EMPTY_CART, serverUrl, ShoppingCartWithDetails } from '../../models/models';
import { CartProductRequest, SetCartRequest } from '../../models/requests';
import { ShoppingCart } from '../../models/models';
import { map, tap, distinctUntilChanged, skip } from 'rxjs/operators';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService implements OnDestroy{

  private readonly URL: string = `${serverUrl}api/users/cart/`;

  private currentCartSubject: BehaviorSubject<ShoppingCart> = new BehaviorSubject(EMPTY_CART);
  private subscriptions: Subscription[] = [];

  get cartChanges(): Observable<ShoppingCart>{
    return this.currentCartSubject;
  }

  get cartEmptyChange(): Observable<boolean>{
    return this.currentCartSubject.pipe(
      map(value=>{
        return Object.keys(value.items).length === 0;
      }),
      distinctUntilChanged()
    )
  }

  get currentCart(): ShoppingCart{
    return this.currentCartSubject.getValue();
  }

  constructor(private http: HttpClient, private authService: AuthService, private productsService: ProductsService) {
    this.readCartFromStorage().subscribe();
    this.subscriptions.push(
      this.cartChanges.pipe(skip(1)).subscribe(this.writeCartToStorage.bind(this)),
      this.authService.loginStatus.subscribe(this.onLoginStatusChange.bind(this))
    );
    if(!this.authService.isLogin()) this.refreshCart().subscribe();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }

  public refreshCart(): Observable<ShoppingCart>{
    if(!environment.production) console.log("refreshing cart");
    if(!this.authService.isLogin()){
      return this.readCartFromStorage();
    }
    return this.http.get<ShoppingCart>(`${this.URL}getCart`).pipe(
      tap(this.tapToRefresh()),
      // catchError(this.handleGetErrors())
    )
  }

  public onLoginStatusChange(isLogin: boolean){
    if(!isLogin) return;
    if(Object.keys(this.currentCart.items).length === 0){
      this.refreshCart().subscribe();
      return;
    }
    this.setCart({products: this.currentCart.items}).subscribe();
  }

  public setProductInCart(request: CartProductRequest): Observable<ShoppingCart>{
    if(!this.authService.isLogin()){
      return this.setProductOnClient(request);
    }
    return this.http.put<ShoppingCart>(`${this.URL}setProduct`, request).pipe(
      tap(this.tapToRefresh()),
      // catchError(this.setProductOnClient(request))
    )
  }

  public setCart(request: SetCartRequest): Observable<ShoppingCart>{
    if(!this.authService.isLogin()){
      return this.setCartOnClient(request);
    }
    return this.http.put<ShoppingCart>(`${this.URL}setCart`, request).pipe(
      tap(this.tapToRefresh()),
      // catchError(this.setCartOnClient(request))
    )
  }

  public addProductToCart(request: CartProductRequest): Observable<ShoppingCart>{
    if(!this.authService.isLogin()){
      return this.addProductOnClient(request);
    }
    return this.http.put<ShoppingCart>(`${this.URL}addProduct`, request).pipe(
      tap(this.tapToRefresh()),
      // catchError(this.addProductOnClient(request))
    )
  }

  public deleteProductFromCart(productId: number): Observable<ShoppingCart>{
    if(!this.authService.isLogin()){
      return this.deleteProductOnClient(productId);
    }
    return this.http.delete<ShoppingCart>(`${this.URL}deleteProduct/${productId}`).pipe(
      tap(this.tapToRefresh())
    );
  }

  public deleteCart(): Observable<ShoppingCart>{
    if(!this.authService.isLogin()){
      return this.deleteCartOnClient();
    }
    return this.http.delete<unknown>(`${this.URL}deleteCart`).pipe(
      map(()=>EMPTY_CART),
      tap(this.tapToRefresh())
    );
  }

  public deleteCartOnClient(): Observable<ShoppingCart>{
    this.currentCartSubject.next(EMPTY_CART);
    return of(EMPTY_CART)
  }

  private deleteProductOnClient(productId: number): Observable<ShoppingCart>{
    let modyfiedCart = this.currentCartSubject.getValue();
    delete modyfiedCart.items[productId];
    this.currentCartSubject.next(modyfiedCart);
    return of(modyfiedCart);
  }

  private setCartOnClient(request: SetCartRequest){
    let modyfiedCart = this.currentCartSubject.getValue();
    modyfiedCart.items = request.products;
    this.currentCartSubject.next(modyfiedCart);
    return of(modyfiedCart);
  }


  private setProductOnClient(request: CartProductRequest){
    let modyfiedCart = this.currentCartSubject.getValue();
    modyfiedCart.items[request.productId] = request.amount;
    this.currentCartSubject.next(modyfiedCart);
    return of(modyfiedCart);
  }
  

  private addProductOnClient(request: CartProductRequest){
    let modyfiedCart = this.currentCartSubject.getValue();
    modyfiedCart.items[request.productId] = request.amount + (modyfiedCart.items[request.productId] || 0);
    this.currentCartSubject.next(modyfiedCart);
    return of(modyfiedCart);
  }

  private tapToRefresh(){
     return (cart: ShoppingCart) =>{
       if(JSON.stringify(cart.items) === JSON.stringify(this.currentCart.items)) return;
       this.currentCartSubject.next(cart);
    };
  }

  private writeCartToStorage(cart: ShoppingCart){
    // if(!this.authService.isLogin()) return;
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
  }

  private readCartFromStorage(): Observable<ShoppingCart>{
    const jsonCart = localStorage.getItem("shoppingCart");
    let cart: ShoppingCart = EMPTY_CART;
    if(jsonCart){
      try{cart = JSON.parse(jsonCart);}
      catch(e){}
    }
    return this.productsService.getProducts(Object.keys(cart.items).map(value=>+value)).pipe(
      map(products=>{
          cart = this.deleteNonexistingProductsFromCart(cart, products);
          cart = this.deleteArchivedProductsFromCart(cart, products);
          this.currentCartSubject.next(cart);
          return cart;
      })
    );
  } 
  
  private deleteArchivedProductsFromCart(cart: ShoppingCart, products: ShopProduct[]): ShoppingCart{
    let archivedIds: string[] = products.filter(product=>product.isArchived).map(product=>product.id.toString());
    Object.keys(cart.items).forEach(key=>{
      if(archivedIds.includes(key))
        delete cart.items[key];
    })
    return cart;
  }

  private deleteNonexistingProductsFromCart(cart: ShoppingCart, products: ShopProduct[]): ShoppingCart{
    let productsIds: string[] = products.map(product=>product.id.toString());
    Object.keys(cart.items).forEach(key=>{
      if(!productsIds.includes(key))
        delete cart.items[key];
    })
    return cart;
  }

  public getDetails(cart: ShoppingCart): Observable<ShoppingCartWithDetails>{
    let productsIds = Object.keys(cart.items).map(v=>+v);
    if(productsIds.length === 0) return of({items: [], expireDate: cart.expireDate, ownerUsername: cart.ownerUsername});
    return this.productsService.getProducts(productsIds).pipe(
      map(products=>{
        let newCart: ShoppingCartWithDetails = {
          expireDate: cart.expireDate,
          ownerUsername: cart.ownerUsername,
          items: products.map(product=>{return {amount: cart.items[product.id], product: product}})
        }
        return newCart;
      })
    )
  }

}
