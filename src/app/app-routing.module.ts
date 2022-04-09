import { ProfileOrderDetailComponent } from './router-components/profile/profile-order-detail/profile-order-detail.component';
import { PayOrderComponent } from './router-components/pay-order/pay-order.component';
import { TypesComponent } from './router-components/types/types.component';
import { AuthorsComponent } from './router-components/authors/authors.component';
import { OrderMakerComponent } from './router-components/order-maker/order-maker.component';
import { NotFoundComponent } from './router-components/not-found/not-found.component';
import { ResetPasswordComponent } from './router-components/reset-password/reset-password.component';
import { HomeComponent } from './router-components/home/home.component';
import { CartComponent } from './router-components/cart/cart.component';
import { ProfileOrdersComponent } from './router-components/profile/profile-orders/profile-orders.component';
import { ProfileSettingsComponent } from './router-components/profile/profile-settings/profile-settings.component';
import { ProductDetailsComponent } from './router-components/product-details/product-details.component';
import { MergeProductsComponent } from './router-components/merge-products/merge-products.component';
import { AddProductComponent } from './router-components/add-product/add-product.component';
import { ProfileComponent } from './router-components/profile/profile.component';
import { RouterGuard } from './services/auth/router.guard';
import { RegisterComponent } from './router-components/register/register.component';
import { LoginComponent } from './router-components/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileOpinionsComponent } from './router-components/profile/profile-opinions/profile-opinions.component';

const routes: Routes = [
  {path: "home", component: HomeComponent},
  {path: "login", component: LoginComponent, canActivate:[RouterGuard]},
  {path: "register", component: RegisterComponent, canActivate: [RouterGuard]},
  {path: "profile", component: ProfileComponent, canActivate: [RouterGuard], children:[
    {path: "settings", component: ProfileSettingsComponent},
    {path: "orders", component: ProfileOrdersComponent},
    {path: "opinions", component: ProfileOpinionsComponent},
    {path: "order/:id", component: ProfileOrderDetailComponent}
  ]},
  {path: "resetPassword/:id", component: ResetPasswordComponent},
  {path: "manageProduct/:id", component: AddProductComponent, canActivate: [RouterGuard]},
  {path: "products", component: MergeProductsComponent, canActivate: [RouterGuard]},
  {path: "offert", component: MergeProductsComponent},
  {path: "product/:id", component: ProductDetailsComponent},
  {path: "cart", component: CartComponent},
  {path: "make-order", component: OrderMakerComponent},
  {path: "authors", component: AuthorsComponent, canActivate: [RouterGuard]},
  {path: "types", component: TypesComponent, canActivate: [RouterGuard]},
  {path: "payOrder/:id", component: PayOrderComponent},
  {path: '', redirectTo: "home", pathMatch: 'full'},
  {path: "**", component: NotFoundComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {
          initialNavigation: 'enabled',
          paramsInheritanceStrategy: 'always',
          // scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
