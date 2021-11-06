import { CartComponent } from './router-components/cart/cart.component';
import { ProfileOrdersComponent } from './router-components/profile/profile-orders/profile-orders.component';
import { ProfileSettingsComponent } from './router-components/profile/profile-settings/profile-settings.component';
import { ProductDetailsComponent } from './router-components/product-details/product-details.component';
import { MergeProductsComponent } from './router-components/merge-products/merge-products.component';
import { AddProductComponent } from './router-components/add-product/add-product.component';
import { ProfileComponent } from './router-components/profile/profile.component';
import { RouterGuard } from './services/auth/router.guard';
import { RegulationsComponent } from './router-components/regulations/regulations.component';
import { RegisterComponent } from './router-components/register/register.component';
import { LoginComponent } from './router-components/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileOpinionsComponent } from './router-components/profile/profile-opinions/profile-opinions.component';

const routes: Routes = [
  {path: "login", component: LoginComponent, canActivate:[RouterGuard]},
  {path: "register", component: RegisterComponent, canActivate: [RouterGuard]},
  {path: "regulations", component: RegulationsComponent},
  {path: "profile", component: ProfileComponent, canActivate: [RouterGuard], children:[
    {path: "settings", component: ProfileSettingsComponent},
    {path: "orders", component: ProfileOrdersComponent},
    {path: "opinions", component: ProfileOpinionsComponent}
  ]},
  {path: "manageProduct/:id", component: AddProductComponent, canActivate: [RouterGuard]},
  {path: "products", component: MergeProductsComponent, canActivate: [RouterGuard]},
  {path: "offert", component: MergeProductsComponent},
  {path: "product/:id", component: ProductDetailsComponent},
  {path: "cart", component: CartComponent, canActivate: [RouterGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
          initialNavigation: 'enabled',
          paramsInheritanceStrategy: 'always'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
