import { Subscription } from 'rxjs';
import { GetProductsParams, PageableParams } from './../../models/requests';
import { ProductsService } from 'src/app/services/http/products.service';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { GetProductsResponse } from 'src/app/models/responses';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductsFilters } from 'src/app/models/models';


@Component({
  selector: 'app-merge-products',
  templateUrl: './merge-products.component.html',
  styleUrls: ['./merge-products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MergeProductsComponent implements OnInit {

  public pageOptions: string[] = ["10", "25", "50"];
  public pageSizeModel: string = "25";
  public pageNumberModel: number = 1;
  private lastRequest?: Subscription;
  public filtersExpanded: boolean = false;

  public httpResponse: GetProductsResponse = {totalElements: 0, totalPages: 1, pageNumber: 0, result: []};
  public productsParams: GetProductsParams = {pageSize: +this.pageSizeModel, pageNumber: this.pageNumberModel};
  public filtersModel: ProductsFilters = {};

  public onFiltersChange(newValue: ProductsFilters){
    // console.log("filter changed");
    this.productsParams = Object.assign({}, this.productsParams);
    this.productsParams = Object.assign(this.productsParams, newValue);
    this.updateRequestParams();
  }

  public onPageNumberChange(newValue: number){
    // console.log("pageNumber changed");
    this.productsParams = Object.assign({}, this.productsParams);
    this.productsParams.pageNumber = newValue;
    this.updateRequestParams();
  }

  public onPageSizeChange(newValue: string){
    // console.log("pageSize changed");
    this.productsParams = Object.assign({}, this.productsParams);
    this.productsParams.pageSize = +newValue;
    this.updateRequestParams();
  }

  constructor(private productService: ProductsService, private cd: ChangeDetectorRef, private router: Router,
     private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // this.refreshProducts();
    this.activatedRoute.queryParams.subscribe(params  =>{
      this.refreshProducts();
      // this.writeParams(params);
    })
  }

  public writeParams(params: Params){
    // this.pageNumberModel = params.pageNumber ? params.pageNumber : this.pageNumberModel
    // this.pageSizeModel = params.pageCount ? params.pageCount : this.pageSizeModel;

    this.productsParams = params;

    this.filtersModel = Object.assign({}, this.productsParams);
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
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.productsParams,
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
    this.lastRequest = this.productService.getAllProducts(this.activatedRoute.snapshot.queryParams).subscribe(response=>{
      
      this.httpResponse = Object.assign({}, response);
      this.httpResponse.totalPages = Math.max(1, response.totalPages);
      let params: GetProductsParams = Object.assign({}, this.activatedRoute.snapshot.queryParams);
      this.pageNumberModel = response.pageNumber;
      params.pageNumber = Math.min(this.httpResponse.totalPages, response.pageNumber);

      params.pageSize = params.pageSize ? this.pageOptions.includes(params.pageSize.toString()) ? params.pageSize
       : +this.pageSizeModel : +this.pageSizeModel;

      this.pageSizeModel = params.pageSize?.toString();

      this.writeParams(params);
      this.updateRequestParams();
      this.cd.markForCheck();
    }, error =>{
      let params: PageableParams = {pageSize: +this.pageSizeModel, pageNumber: this.pageNumberModel};
       this.writeParams(params);
       this.updateRequestParams();
    });
  }

  public scrollUp(){
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }

}
