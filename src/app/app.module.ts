import { ProfileOrdersComponent } from './router-components/profile/profile-orders/profile-orders.component';
import { NavButtonDirective } from './directives/nav-button/nav-button.directive';
import { EditableMultiSelectComponent, MultiSelectItemComponent } from './utils-components/multi-selects/dropdown-multi-select/dropdown-multi-select.component';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './router-components/nav/nav.component';
import { LoginComponent } from './router-components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RegisterComponent } from './router-components/register/register.component';
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
import { ProductsComponent } from './router-components/products/products.component';
import { ProductTileComponent } from './utils-components/products-utils/product-tile/product-tile.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProductsFiltersComponent } from './utils-components/products-utils/products-filters/products-filters.component';
import { ButtonModule } from 'primeng/button';
import { ProductDetailsComponent } from './router-components/product-details/product-details.component';
import { ProductImageComponent } from './utils-components/products-utils/product-image/product-image.component';
import { ProfileSettingsComponent } from './router-components/profile/profile-settings/profile-settings.component';
import { ProfileOpinionsComponent } from './router-components/profile/profile-opinions/profile-opinions.component';
import { BusyOverlayComponent } from './utils-components/busy-overlay/busy-overlay.component';
import { TreeMenuComponent } from './utils-components/tree-menu/tree-menu.component';
import { AccordionModule } from 'primeng/accordion';
import { SidebarComponent } from './utils-components/sidebar/sidebar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { DialogComponent } from './utils-components/dialogs/dialog/dialog.component';
import { ChangeEmailComponent } from './router-components/profile/profile-settings/change-email/change-email.component';
import { ChangePasswordComponent } from './router-components/profile/profile-settings/change-password/change-password.component';
import { PasswordInputComponent } from './utils-components/password-input/password-input.component';
import { SelectableListComponent } from './utils-components/selectable-list/selectable-list.component';
import { CheckboxComponent } from './utils-components/checkbox/checkbox.component';
import { CartComponent } from './router-components/cart/cart.component';
import { CartEditorComponent, CartEditorElementComponent } from './utils-components/cart-editor/cart-editor.component';
import { HomeComponent } from './router-components/home/home.component';
import { AuthorsSelectComponent } from './utils-components/authors-utils/authors-select/authors-select.component';
import { TypesSelectComponent } from './utils-components/multi-selects/types-select/types-select.component';
import { AuthorCreatorComponent } from './utils-components/authors-utils/author-creator/author-creator.component';
import { PageSelectComponent } from './utils-components/page-select/page-select.component';
import { FiltersDialogComponent } from './utils-components/dialogs/filters-dialog/filters-dialog.component';
import { AccordionMultiSelectComponent } from './utils-components/multi-selects/accordion-multi-select/accordion-multi-select.component';
import { AbstractMultiSelectComponent } from './utils-components/multi-selects/abstract-multi-select/abstract-multi-select.component';
import { TypesCreatorComponent } from './utils-components/types-utils/types-creator/types-creator.component';
import { RadioButtonModule } from "primeng/radiobutton";
import { SingleSelectComponent } from './utils-components/single-select/single-select.component';
import { ProductCreatorComponent } from './utils-components/products-utils/product-creator/product-creator.component';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { ForgotPasswordDialogComponent } from './utils-components/dialogs/forgot-password-dialog/forgot-password-dialog.component';
import { ResetPasswordComponent } from './router-components/reset-password/reset-password.component';
import { WildcartComponent } from './utils-components/wildcart/wildcart.component';
import { NotFoundComponent } from './router-components/not-found/not-found.component';
import {InputMaskModule} from 'primeng/inputmask';
import { UserInfoFormComponent } from './utils-components/user-info-form/user-info-form.component';
import { OrderMakerComponent } from './router-components/order-maker/order-maker.component';
import { OrderTileComponent } from './utils-components/order-tile/order-tile.component';
import { OrdersFiltersComponent } from './utils-components/orders-filters/orders-filters.component';
import {CalendarModule} from 'primeng/calendar';
import { LinkTileComponent } from './utils-components/link-tile/link-tile.component';
import { AuthorsComponent } from './router-components/authors/authors.component';
import { AuthorsListComponent } from './utils-components/authors-utils//authors-list/authors-list.component';
import { AuthorsFiltersComponent } from './utils-components/authors-utils/authors-filters/authors-filters.component';
import { PageSizeSelectComponent } from './utils-components/page-size-select/page-size-select.component';
import { AuthorsFiltersDialogComponent } from './utils-components/authors-utils//authors-filters-dialog/authors-filters-dialog.component';
import { ScrollerComponent } from './utils-components/scroller/scroller.component';
import { TypesComponent } from './router-components/types/types.component';
import { TypesListComponent } from './utils-components/types-utils/types-list/types-list.component';
import { TypesFiltersComponent } from './utils-components/types-utils/types-filters/types-filters.component';
import { TypesFiltersDialogComponent } from './utils-components/types-utils/types-filters-dialog/types-filters-dialog.component';
import { PayOrderComponent } from './router-components/pay-order/pay-order.component';
import { OrdersFiltersDialogComponent } from './utils-components/orders-filters-dialog/orders-filters-dialog.component';
import { ProfileOrderDetailComponent } from './router-components/profile/profile-order-detail/profile-order-detail.component';
registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    AddProductComponent,
    EditableMultiSelectComponent,
    MultiSelectItemComponent,
    NavButtonDirective,
    InputTextDirective,
    ButtonDirective,
    AuthImgPipe,
    ProductsComponent,
    ProductTileComponent,
    ProductsFiltersComponent,
    ProductDetailsComponent,
    ProductImageComponent,
    ProfileSettingsComponent,
    ProfileOpinionsComponent,
    ProfileOrdersComponent,
    BusyOverlayComponent,
    TreeMenuComponent,
    SidebarComponent,
    DialogComponent,
    ChangeEmailComponent,
    ChangePasswordComponent,
    PasswordInputComponent,
    SelectableListComponent,
    CheckboxComponent,
    CartComponent,
    CartEditorComponent,
    CartEditorElementComponent,
    HomeComponent,
    AuthorsSelectComponent,
    TypesSelectComponent,
    AuthorCreatorComponent,
    PageSelectComponent,
    FiltersDialogComponent,
    AccordionMultiSelectComponent,
    AbstractMultiSelectComponent,
    TypesCreatorComponent,
    SingleSelectComponent,
    ProductCreatorComponent,
    ForgotPasswordDialogComponent,
    ResetPasswordComponent,
    WildcartComponent,
    NotFoundComponent,
    UserInfoFormComponent,
    OrderMakerComponent,
    OrderTileComponent,
    OrdersFiltersComponent,
    LinkTileComponent,
    AuthorsComponent,
    AuthorsListComponent,
    AuthorsFiltersComponent,
    PageSizeSelectComponent,
    AuthorsFiltersDialogComponent,
    ScrollerComponent,
    TypesComponent,
    TypesListComponent,
    TypesFiltersComponent,
    TypesFiltersDialogComponent,
    PayOrderComponent,
    OrdersFiltersDialogComponent,
    ProfileOrderDetailComponent
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
    MultiSelectModule,
    ButtonModule,
    AccordionModule,
    LayoutModule,
    RadioButtonModule,
    InputMaskModule,
    CalendarModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: LOCALE_ID, useValue: 'fr'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

