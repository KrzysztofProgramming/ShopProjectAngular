import { MergeProductsComponent } from './router-components/merge-products/merge-products.component';
import { AddProductComponent } from './router-components/add-product/add-product.component';
import { ProfileComponent } from './router-components/profile/profile.component';
import { RouterGuard } from './services/auth/router.guard';
import { RegulationsComponent } from './router-components/regulations/regulations.component';
import { RegisterComponent } from './router-components/register/register.component';
import { LoginComponent } from './router-components/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: "login", component: LoginComponent, canActivate:[RouterGuard]},
  {path: "register", component: RegisterComponent, canActivate: [RouterGuard]},
  {path: "regulations", component: RegulationsComponent},
  {path: "profile", component: ProfileComponent},
  {path: "product/:id", component: AddProductComponent, canActivate: [RouterGuard]},
  {path: "products", component: MergeProductsComponent, canActivate: [RouterGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
