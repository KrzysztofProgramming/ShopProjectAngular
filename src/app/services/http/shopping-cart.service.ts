import { AuthService } from './../auth/auth.service';
import { ProductsService } from './products.service';
import { EMPTY_CART, ShoppingCartWithDetails } from './../../models/models';
import { CartProductRequest, SetCartRequest } from '../../models/requests';
import { ShoppingCart } from '../../models/models';
import { map, tap, distinctUntilChanged } from 'rxjs/operators';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService implements OnDestroy{

  private readonly URL: string = 'http://localhost:8080/api/users/cart/';

  private currentCartSubject!: BehaviorSubject<ShoppingCart>;
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
    this.readCartFromStorage();
    this.subscriptions.push(
      this.cartChanges.subscribe(this.writeCartToStorage.bind(this)),
      this.authService.loginStatus.subscribe(this.onLoginStatusChange.bind(this))
    );
    if(!this.authService.isLogin()) this.refreshCart().subscribe();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }

  public refreshCart(): Observable<ShoppingCart>{
    console.log("refreshing cart");
    if(!this.authService.isLogin()){
      return of(this.readCartFromStorage());
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
    console.log("setting product in cart");
    if(!this.authService.isLogin()){
      return this.setProductOnClient(request);
    }
    return this.http.put<ShoppingCart>(`${this.URL}setProduct`, request).pipe(
      tap(this.tapToRefresh()),
      // catchError(this.setProductOnClient(request))
    )
  }

  public setCart(request: SetCartRequest): Observable<ShoppingCart>{
    console.log("setting cart");
    if(!this.authService.isLogin()){
      return this.setCartOnClient(request);
    }
    return this.http.put<ShoppingCart>(`${this.URL}setCart`, request).pipe(
      tap(this.tapToRefresh(), error=>console.log("tap error")),
      // catchError(this.setCartOnClient(request))
    )
  }

  public addProductToCart(request: CartProductRequest): Observable<ShoppingCart>{
    console.log("adding product to cart");
    if(!this.authService.isLogin()){
      return this.addProductOnClient(request);
    }
    return this.http.put<ShoppingCart>(`${this.URL}addProduct`, request).pipe(
      tap(this.tapToRefresh()),
      // catchError(this.addProductOnClient(request))
    )
  }

  public deleteProductFromCart(productId: string): Observable<ShoppingCart>{
    console.log("delete product");
    if(!this.authService.isLogin()){
      return this.deleteProductOnClient(productId);
    }
    return this.http.delete<ShoppingCart>(`${this.URL}deleteProduct/${productId}`).pipe(
      tap(this.tapToRefresh())
    );
  }

  public deleteCart(): Observable<ShoppingCart>{
    console.log("delete cart");
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

  private deleteProductOnClient(productId: string): Observable<ShoppingCart>{
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
       console.log("tap: ", cart);
       if(JSON.stringify(cart.items) === JSON.stringify(this.currentCart.items)) return;
       this.currentCartSubject.next(cart);
    };
  }

  private handleGetErrors() {
    return () =>{
      return of(this.readCartFromStorage());
    }
  }

  private writeCartToStorage(cart: ShoppingCart){
    // if(!this.authService.isLogin()) return;
    console.log("writing to storage");
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
  }

  private readCartFromStorage(): ShoppingCart{
    console.log("reading cart from storage");
    const jsonCart = localStorage.getItem("shoppingCart");
    let cart: ShoppingCart = EMPTY_CART;
    if(jsonCart){
      try{cart = JSON.parse(jsonCart);}
      catch(e){}
    }
    if(!this.currentCartSubject)
      this.currentCartSubject = new BehaviorSubject(cart);
    else
      this.currentCartSubject.next(cart);
    return cart;
  } 
  
  public getDetails(cart: ShoppingCart): Observable<ShoppingCartWithDetails>{
    let productsIds = Object.keys(cart.items);
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
