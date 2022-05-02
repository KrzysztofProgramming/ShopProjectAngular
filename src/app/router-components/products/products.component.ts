import { SortOption, SORT_OPTIONS, SORT_OPTIONS_ADMIN } from './../../models/models';
import { ShopProduct } from '../../models/models';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subscription, Subject } from 'rxjs';
import { GetProductsParams, DEFAULT_PRODUCTS_PARAMS, DEFAULT_PAGEABLE, PAGE_SIZES } from '../../models/requests';
import { ProductsService } from 'src/app/services/http/products.service';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, HostListener, ViewChild, ElementRef } from '@angular/core';
import { GetProductsResponse } from 'src/app/models/responses';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { FiltersDialogModel } from 'src/app/utils-components/dialogs/filters-dialog/filters-dialog.component';

@Component({
  selector: 'app-merge-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:[
    trigger("hideWhileScrolling",[
      state("hidden", style({"transform": "translateY(-100%)"})),
      state("showed", style("*")),
      transition("hidden <=> showed", animate("200ms ease"))
    ])
  ]
})
export class ProductsComponent implements OnInit {

  public pageOptions: number[] = PAGE_SIZES;
  public sortOptions: SortOption[] = SORT_OPTIONS;

  private lastRequest?: Subscription;
  public filtersExpanded: boolean = false;

  public httpResponse: GetProductsResponse = {totalElements: 0, totalPages: 1, pageNumber: 0, result: []};
  public productsParams: GetProductsParams = DEFAULT_PRODUCTS_PARAMS;

  public dialogModel: FiltersDialogModel = {};

  public waitingForResponse: boolean = false;
  public lastScrollTop: number = 0;
  public hideSearchBar: boolean = false;
  @ViewChild("topBar")
  private topBarElement!: ElementRef<HTMLDivElement>;
  private searchPhraseSubject: Subject<string> = new Subject();
  private subscriptions: Subscription[] = [];
  private adminMode: boolean = false;


  @HostListener("window:scroll", ["$event"])
  public onScrollListener(event: Event){
    const newScrollTop = window.scrollY || document.documentElement.scrollTop;
    
    if(newScrollTop < this.lastScrollTop){ //scrolling up
      this.hideSearchBar = false;
    }
    else if(newScrollTop > this.lastScrollTop){ //scrolling down
      this.hideSearchBar = true;
    }
    const topBar = this.topBarElement.nativeElement;
    this.hideSearchBar = this.hideSearchBar && newScrollTop > topBar.offsetHeight; 
    this.lastScrollTop = newScrollTop;
  
    this.cd.markForCheck();
  }

  public openFiltersDialog(){
    this.filtersExpanded = true;
    this.cd.markForCheck();
  }

  public onSearchPhraseChanged(newValue: string){
    this.searchPhraseSubject.next(newValue);
  }

  public onParamsModelChange(){
    this.updateRequestParams();
  }

  constructor(private productService: ProductsService, private cd: ChangeDetectorRef, private router: Router,
     private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // this.refreshProducts();
    this.activatedRoute.queryParams.subscribe((params) =>{
      this.refreshProducts(params);
      // this.writeParams(params);
    })
    this.setAdminMode(this.router.url.startsWith("/products"));
    this.subscriptions.push(
        this.searchPhraseSubject.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(this.onParamsModelChange.bind(this)),
      this.router.events.subscribe(event=>{
        if(event instanceof NavigationEnd){
          this.setAdminMode(event.url.startsWith("/products"));
          console.log(this.sortOptions);
        }
      })
    );
  }

  private setAdminMode(value: boolean){
    this.adminMode = value;
    if(value){
      this.sortOptions = SORT_OPTIONS_ADMIN
    }
    else{
      this.sortOptions = SORT_OPTIONS;
    }  
    this.cd.markForCheck();
  }

  trackByProductId(index: number, product: ShopProduct){
    return product.id;
  }

  public writeParams(params: Params){
    // this.pageNumberModel = params.pageNumber ? params.pageNumber : this.pageNumberModel
    // this.pageSizeModel = params.pageCount ? params.pageCount : this.pageSizeModel;

    this.productsParams = params;
    this.cd.markForCheck();
  }

  public navigateToProduct(id: string){
    if(this.isAdminMode()){
      this.router.navigateByUrl("manageProduct/" + id);
    }
    else{
      this.router.navigateByUrl("product/" + id);
    }
  }

  public generateProductUrl(id: number){
    if(this.isAdminMode()){
      return "/manageProduct/" + id;
    }
    else{
      return "/product/" + id;
    }
  }

  public updateRequestParams(){
    const params = Object.assign({}, this.productsParams);
    if(params.pageSize === DEFAULT_PAGEABLE.pageSize) params.pageSize = undefined;
    if(params.pageNumber === DEFAULT_PAGEABLE.pageNumber) params.pageNumber = undefined;
    if(params.sort === "none") params.sort = undefined;
    if(params.searchPhrase === "") params.searchPhrase = undefined;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: params,
    });
  }

  public isAdminMode(){
    return this.adminMode;
  }

  public cancelRequest(){
    if(this.lastRequest){
      this.lastRequest.unsubscribe();
    };
  }

  public refreshProducts(params: Params = this.activatedRoute.snapshot.queryParams): void{
    this.cancelRequest();
    this.waitingForResponse = true;
    this.lastRequest = this.productService.getAllProducts(params).subscribe(response=>{
      this.httpResponse = Object.assign({}, response);
      this.httpResponse.totalPages = Math.max(1, response.totalPages);
      let routerParams: GetProductsParams = Object.assign({}, DEFAULT_PRODUCTS_PARAMS);
      Object.assign(routerParams, params);
      routerParams.pageNumber = Math.min(this.httpResponse.totalPages, response.pageNumber);

      if(routerParams.pageSize)
        routerParams.pageSize = this.pageOptions.includes(+routerParams.pageSize) ? +routerParams.pageSize
         : this.productsParams.pageSize

      if(routerParams.types && !Array.isArray(routerParams.types))
        routerParams.types = [(routerParams.types as unknown) as string].map(value=>+value);
      else if(routerParams.types)
        routerParams.types = routerParams.types.map(value=>+value);
        
      if(routerParams.authors && !Array.isArray(routerParams.authors))
        routerParams.authors = [(routerParams.authors as unknown) as string].map(value=>+value);
      else if(routerParams.authors)
        routerParams.authors = routerParams.authors.map(value=>+value);
      
        
      console.log(routerParams);
      this.writeParams(routerParams);
      this.updateRequestParams();
      this.waitingForResponse = false;
      this.cd.markForCheck();
    }, error =>{
       this.writeParams(DEFAULT_PRODUCTS_PARAMS);
       this.updateRequestParams();
       this.waitingForResponse = false;
       this.cd.markForCheck();
    });
  }

}
