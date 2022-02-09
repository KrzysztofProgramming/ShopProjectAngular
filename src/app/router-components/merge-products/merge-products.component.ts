import { ShopProduct } from './../../models/models';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subscription, Subject } from 'rxjs';
import { GetProductsParams, DEFAULT_PRODUCTS_PARAMS, DEFAULT_PAGEABLE } from './../../models/requests';
import { ProductsService } from 'src/app/services/http/products.service';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, HostListener, ViewChild, ElementRef } from '@angular/core';
import { GetProductsResponse } from 'src/app/models/responses';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PAGE_SIZES } from 'src/app/models/models';
import { FiltersDialogModel } from 'src/app/utils-components/dialogs/filters-dialog/filters-dialog.component';

@Component({
  selector: 'app-merge-products',
  templateUrl: './merge-products.component.html',
  styleUrls: ['./merge-products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:[
    trigger("hideWhileScrolling",[
      state("hidden", style({"transform": "translateY(-100%)"})),
      state("showed", style("*")),
      transition("hidden <=> showed", animate("200ms ease"))
    ]),
    trigger("opacityEntry", [
      state("void", style({"opacity": 0})),
      state("*", style("*")),
      transition("void <=> *", animate("200ms ease"))
    ])
  ]
})
export class MergeProductsComponent implements OnInit {

  public pageOptions: number[] = PAGE_SIZES;

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
    this.activatedRoute.queryParams.subscribe(() =>{
      this.refreshProducts();
      // this.writeParams(params);
    })
    this.subscriptions.push(this.searchPhraseSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(this.onParamsModelChange.bind(this)));
  }

  trackByProductId(index: number, product: ShopProduct){
    return product.id;
  }

  public writeParams(params: Params){
    // this.pageNumberModel = params.pageNumber ? params.pageNumber : this.pageNumberModel
    // this.pageSizeModel = params.pageCount ? params.pageCount : this.pageSizeModel;

    this.productsParams = params;
    console.log(this.productsParams);
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
    return this.router.url.startsWith("/products");
  }

  public cancelPreviousRequest(){
    if(this.lastRequest){
      this.lastRequest.unsubscribe();
    };
  }

  public refreshProducts(): void{
    this.isAdminMode();
    this.cancelPreviousRequest();
    this.waitingForResponse = true;
    this.lastRequest = this.productService.getAllProducts(this.activatedRoute.snapshot.queryParams).subscribe(response=>{
      
      this.httpResponse = Object.assign({}, response);
      this.httpResponse.totalPages = Math.max(1, response.totalPages);
      let routerParams: GetProductsParams = Object.assign({}, DEFAULT_PRODUCTS_PARAMS);
      Object.assign(routerParams, this.activatedRoute.snapshot.queryParams);
      routerParams.pageNumber = Math.min(this.httpResponse.totalPages, response.pageNumber);

      routerParams.pageSize = this.pageOptions.includes(routerParams.pageSize!) ? routerParams.pageSize
       : this.productsParams.pageSize

      if(routerParams.types && !Array.isArray(routerParams.types))
        routerParams.types = [(routerParams.types as unknown) as string];
      if(routerParams.authorsNames && !Array.isArray(routerParams.authorsNames))
        routerParams.authorsNames = [(routerParams.authorsNames as unknown) as string];
      
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

  public scrollUp(){
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }

}
