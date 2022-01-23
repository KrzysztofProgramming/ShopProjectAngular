import { CartProductRequest, SetCartRequest } from '../../models/requests';
import { AuthService } from '../auth/auth.service';
import { ShoppingCart } from '../../models/models';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService implements OnDestroy{

  private readonly URL: string = 'http://localhost:8080/api/users/cart/';
  public readonly DEFAULT_CART: ShoppingCart = {items: {}};
  private currentCartSubject!: BehaviorSubject<ShoppingCart>;
  private subscriptions: Subscription[] = [];

  get cartChanges(): Observable<ShoppingCart>{
    return this.currentCartSubject;
  }

  get currentCart(): ShoppingCart{
    return this.currentCartSubject.getValue();
  }

  constructor(private http: HttpClient, private authService: AuthService) {
    this.readCartFromStorage();
    this.subscriptions.push(
      this.cartChanges.subscribe(cart => this.writeCartToStorage(cart))
    );
    this.refreshCart().subscribe(()=>{});
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }

  public refreshCart(): Observable<ShoppingCart>{
    console.log("refreshing");
    if(!this.authService.isLogin()){
      return this.handleGetErrors()();
    }
    return this.http.get<ShoppingCart>(`${this.URL}getCart`).pipe(
      tap(this.tapToRefresh()),
      // catchError(this.handleGetErrors())
    )
  }

  public setProductInCart(request: CartProductRequest): Observable<ShoppingCart>{
    if(!this.authService.isLogin()){
      return this.setProductOnClient(request)();
    }
    return this.http.put<ShoppingCart>(`${this.URL}setProduct`, request).pipe(
      tap(this.tapToRefresh()),
      // catchError(this.setProductOnClient(request))
    )
  }

  public setCart(request: SetCartRequest): Observable<ShoppingCart>{
    if(!this.authService.isLogin()){
      return this.setCartOnClient(request)();
    }
    return this.http.put<ShoppingCart>(`${this.URL}setCart`, request).pipe(
      tap(this.tapToRefresh()),
      // catchError(this.setCartOnClient(request))
    )
  }

  public addProductToCart(request: CartProductRequest): Observable<ShoppingCart>{
    if(!this.authService.isLogin()){
      return this.addProductOnClient(request)();
    }
    return this.http.put<ShoppingCart>(`${this.URL}addProduct`, request).pipe(
      tap(this.tapToRefresh()),
      // catchError(this.addProductOnClient(request))
    )
  }

  public setCartOnClient(request: SetCartRequest){
     return (): Observable<ShoppingCart>=>{
        let modyfiedCart = this.currentCartSubject.getValue();
        modyfiedCart.items = request.products;
        this.currentCartSubject.next(modyfiedCart);
        return of(modyfiedCart);
      }
  }


  public setProductOnClient(request: CartProductRequest){
    return ()=>{
      let modyfiedCart = this.currentCartSubject.getValue();
      modyfiedCart.items[request.productId] = request.amount;
      this.currentCartSubject.next(modyfiedCart);
      return of(modyfiedCart);
    }
  }
  
  public addProductOnClient(request: CartProductRequest){
    return ()=>{
      let modyfiedCart = this.currentCartSubject.getValue();
      modyfiedCart.items[request.productId] = request.amount + (modyfiedCart.items[request.productId] || 0);
      this.currentCartSubject.next(modyfiedCart);
      return of(modyfiedCart);
    }
  }

  public tapToRefresh(){
     return (cart: ShoppingCart) =>{
      console.log("tapping");
       this.currentCartSubject.next(cart);
    };
  }

  public handleGetErrors() {
    return () =>{
      return of(this.readCartFromStorage());
    }
  }

  private writeCartToStorage(cart: ShoppingCart){
    // if(!this.authService.isLogin()) return;
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
  }

  private readCartFromStorage(): ShoppingCart{
    const jsonCart = localStorage.getItem("shoppingCart");
    let cart: ShoppingCart = this.DEFAULT_CART;
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
  
}
