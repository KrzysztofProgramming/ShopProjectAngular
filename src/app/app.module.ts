import { StoreModule } from '@ngrx/store';
import { AuthService } from './services/auth/auth.service';
import { NavButtonDirective } from './directives/nav-button/nav-button.directive';
import { EditableMultiSelectComponent, MultiSelectItemComponent } from './utils-components/editable-multi-select/editable-multi-select.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './router-components/nav/nav.component';
import { LoginComponent } from './router-components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RegisterComponent } from './router-components/register/register.component';
import { RegulationsComponent } from './router-components/regulations/regulations.component';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ProfileComponent } from './router-components/profile/profile.component';
import { AddProductComponent } from './router-components/add-product/add-product.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MenubarModule } from 'primeng/menubar'
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { InputTextDirective } from './directives/input-text/input-text.directive';
import { ButtonDirective } from './directives/button/button.directive';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { AuthInterceptor } from './services/auth/auth.interceptor';
import { AuthImgPipe } from './pipes/auth-img.pipe';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MergeProductsComponent } from './router-components/merge-products/merge-products.component';
import { ProductTileComponent } from './utils-components/product-tile/product-tile.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProductsFiltersComponent } from './utils-components/products-filters/products-filters.component';
import {ButtonModule} from 'primeng/button';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    RegisterComponent,
    RegulationsComponent,
    ProfileComponent,
    AddProductComponent,
    EditableMultiSelectComponent,
    MultiSelectItemComponent,
    NavButtonDirective,
    InputTextDirective,
    ButtonDirective,
    AuthImgPipe,
    MergeProductsComponent,
    ProductTileComponent,
    ProductsFiltersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    CheckboxModule,
    FormsModule,
    InputNumberModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    BrowserAnimationsModule,
    MenubarModule,
    SidebarModule,
    PanelMenuModule,
    TooltipModule,
    ToastModule,
    RippleModule,
    ConfirmDialogModule,
    MultiSelectModule,
    ButtonModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

