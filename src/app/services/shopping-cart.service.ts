import { SetCartProductRequest, SetCartRequest } from './../models/requests';
import { AuthService } from './auth/auth.service';
import { ShoppingCart } from './../models/models';
import { catchError, tap } from 'rxjs/operators';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService implements OnInit, OnDestroy{

  private readonly URL: string = 'http://localhost:8080/api/users/cart/';
  public readonly DEFAULT_CART: ShoppingCart = {items: {}};
  private currentCart: BehaviorSubject<ShoppingCart> = new BehaviorSubject<ShoppingCart>(this.DEFAULT_CART);
  private subscriptions: Subscription[] = [];

  get cartChanges(): Observable<ShoppingCart>{
    return this.currentCart;
  }

  constructor(private http: HttpClient, private authService: AuthService) {
    this.subscriptions.push(
      this.cartChanges.subscribe(cart => this.writeCartToStorage(cart))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }

  ngOnInit(): void {
    this.refreshCart().subscribe();
  }

  public refreshCart(): Observable<ShoppingCart>{
    if(this.authService.isLogin()){
      return this.handleGetErrors()();
    }
    return this.http.get<ShoppingCart>(`${this.URL}getCart`).pipe(
      catchError(this.handleGetErrors()),
      tap(this.tapToRefresh())
    )
  }

  public setProductInCart(request: SetCartProductRequest): Observable<ShoppingCart>{
    if(!this.authService.isLogin()){
      return this.setProductOnClient(request)();
    }
    return this.http.put<ShoppingCart>(`${this.URL}setProduct`, request).pipe(
      tap(this.tapToRefresh()),
      catchError(this.setProductOnClient(request))
    )
  }

  public setCart(request: SetCartRequest): Observable<ShoppingCart>{
    if(!this.authService.isLogin){
      return this.setCartOnClient(request)();
    }
    return this.http.put<ShoppingCart>(`${this.URL}setCart`, request).pipe(
      tap(this.tapToRefresh()),
      catchError(this.setCartOnClient(request))
    )
  }

  public setCartOnClient(request: SetCartRequest){
     return (): Observable<ShoppingCart>=>{
        let modyfiedCart = this.currentCart.getValue();
        modyfiedCart.items = request.products;
        this.currentCart.next(modyfiedCart);
        return of(modyfiedCart);
      }
  }

  public setProductOnClient(request: SetCartProductRequest){
    return ()=>{
      let modyfiedCart = this.currentCart.getValue();
      modyfiedCart.items[request.productId] = request.amount
      this.currentCart.next(modyfiedCart);
      return of(modyfiedCart);
    }
  }

  public tapToRefresh(){
     return (cart: ShoppingCart) =>{
       this.currentCart.next(cart);
    };
  }

  public handleGetErrors() {
    return () =>{
      return of(this.readCartFromStorage());
    }
  }

  private writeCartToStorage(cart: ShoppingCart){
    sessionStorage.setItem("shoppingCart", JSON.stringify(cart));
  }

  private readCartFromStorage(): ShoppingCart{
    const jsonCart = sessionStorage.getItem("shoppingCart");
    let cart: ShoppingCart = this.DEFAULT_CART;
    if(jsonCart){
      try{cart = JSON.parse(jsonCart);}
      catch(e){}
    }
    this.currentCart.next(cart);
    return cart;
  } 
  
}
