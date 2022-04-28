import { TypeResponse } from './../../../models/responses';
import { ToastMessageService } from 'src/app/services/utils/toast-message.service';
import { Subscription } from 'rxjs';
import { DEFAULT_PAGEABLE, PAGE_SIZES, DEFAULT_AUTHORS_PARAMS } from 'src/app/models/requests';
import { GetTypesParams } from '../../../models/requests';
import { CommonType } from '../../../models/models';
import { GetTypesResponse } from '../../../models/responses';
import { ProductsService } from '../../../services/http/products.service';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'shop-types-list',
  templateUrl: './types-list.component.html',
  styleUrls: ['./types-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypesListComponent implements OnInit, OnDestroy {

  public response?: GetTypesResponse;
  public params: GetTypesParams = Object.assign({}, DEFAULT_PAGEABLE);
  public pageSizes: number[] = PAGE_SIZES;
  public currentRequest?: Subscription;
  public editingType?: CommonType;
  public creatorVisibility: boolean = false;
  public waitingForResponse = false;
  public deleteDialogVisibility: boolean = false;
  public filtersVisibility: boolean = false;
  public subscriptions: Subscription[] = [];

  public get editorVisibility(): boolean{
    return this.editingType != undefined
  }
  public set editorVisibility(value: boolean){
    if(!value) this.editingType = undefined;
  }

  constructor(private productsService: ProductsService, private cd: ChangeDetectorRef, private router: Router,
     private messageService: ToastMessageService, private route: ActivatedRoute) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe())
  }

  ngOnInit(): void {
    this.reloadTypes();
    this.subscriptions.push(
      this.route.queryParams.subscribe(params=>{
        this.params = Object.assign({}, params);
        this.reloadTypes();
      })
    )
  }

  trackByName(index: number, type: CommonType){
    return type.name;
  }

  
  public reloadTypes(params: Params = this.params){
    // this.waitingForResponse = true;
    this.currentRequest = this.productsService.getTypesDetails(params).subscribe(response=>{
      this.response = response;
      this.response.totalPages = Math.max(1, this.response.totalPages);
      this.params = Object.assign(this.params, params);
      this.params.pageNumber = Math.min(response.pageNumber, response.totalPages);
      if(this.params.pageSize) this.params.pageSize = +this.params.pageSize;
      this.navigateToParams();
      this.requestFinished();
      this.cd.markForCheck();
    }, error=>{
      this.params = DEFAULT_AUTHORS_PARAMS;
      this.requestFinished();
      this.navigateToParams(true);
    })
    this.cd.markForCheck();
  }

  public requestFinished(){
    this.waitingForResponse = false;
    this.cd.markForCheck();
  }

  public onModelChange(){
    this.navigateToParams();
  }

  public newTypeClicked(){
    this.creatorVisibility = true;
    this.cd.markForCheck();
  }

  public showFilters(){
    this.filtersVisibility = true;
    this.cd.markForCheck();
  }

  public navigateToParams(skipLocationChange: boolean = false){
    const params = Object.assign({}, this.params);
    if(params.pageSize === DEFAULT_PAGEABLE.pageSize) params.pageSize = undefined;
    if(params.pageNumber === DEFAULT_PAGEABLE.pageNumber) params.pageNumber = undefined;
    if(params.searchPhrase?.length === 0) params.searchPhrase = undefined;
    this.router.navigate([], {queryParams: params, relativeTo: this.route, skipLocationChange: skipLocationChange});
  }

  public deleteSelectedType(){
    if(!this.editingType) return;
    this.waitingForResponse = true;
    this.deleteDialogVisibility = false;
    this.productsService.deleteType(this.editingType.id).subscribe(()=>{
      this.messageService.showMessage({severity: "success", summary:"Sukces", detail: "Autor usunięty"});
      this.requestFinished();
      this.reloadTypes(this.params);
    }, error=>{
      let details = error.error.info ? error.error.info: "Nie udało się usunąć autora";
      this.messageService.showMessage({severity: "success", summary:"Niepowodzenie", detail: details});
      this.requestFinished();
    });
  }


  public cancelRequest(){
    if(!this.currentRequest) return;
    this.currentRequest.unsubscribe();
    this.currentRequest = undefined
  }

  public navigateToType(type: CommonType){
    let params: Params = {types: type.name};
    this.router.navigate(['products'], {queryParams: params});
  }

  public generateProductsUrl(type: CommonType): string{
    return `/products?types=${type.name}`;
  }

  public deleteClicked(type: CommonType){
    if(!type) return;
    this.waitingForResponse = true;
    this.deleteDialogVisibility = false;
    this.productsService.deleteType(type.id).subscribe(()=>{
      this.messageService.showMessage({severity: "success", summary:"Sukces", detail: "Typ usunięty"});
      this.requestFinished();
      this.reloadTypes();
    }, error=>{
      let details = error.error.info ? error.error.info: "Nie udało się usunąć typu";
      this.messageService.showMessage({severity: "success", summary:"Niepowodzenie", detail: details});
      this.requestFinished();
    });
    this.cd.markForCheck();
  }

  public setEditingType(type: CommonType){
    this.editingType = type;
    this.cd.markForCheck();
  }

  public onTypeChange(type: TypeResponse){
    if(!this.response) return;
    let index = this.response.result.findIndex(value=>value.name===type.name);
    if(index < 0) return;
    this.response.result[index] = {id: type.id, name: type.name, productsCount: this.response.result[index].productsCount};
    this.cd.markForCheck();
  }
}
