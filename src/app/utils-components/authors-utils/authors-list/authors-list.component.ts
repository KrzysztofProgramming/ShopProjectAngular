import { ToastMessageService } from '../../../services/utils/toast-message.service';
import { Subscription } from 'rxjs';
import { GetAuthorsResponse } from '../../../models/responses';
import { AuthorsService } from '../../../services/http/authors.service';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import { DEFAULT_AUTHORS_PARAMS, GetAuthorsParams, PAGE_SIZES, DEFAULT_PAGEABLE } from 'src/app/models/requests';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Author } from 'src/app/models/models';

@Component({
  selector: 'shop-authors-list',
  templateUrl: './authors-list.component.html',
  styleUrls: ['./authors-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorsListComponent implements OnInit {

  response?: GetAuthorsResponse;
  waitingForResponse: boolean = true;
  currentRequest?: Subscription;
  params: GetAuthorsParams = Object.assign({}, DEFAULT_AUTHORS_PARAMS);
  authorToDelete?: Author;
  deleteDialogVisibility: boolean = false;
  editingAuthor?: Author;
  creatorVisibility: boolean = false;
  filtersVisibility: boolean = false;

  readonly pageSizes: number[] = PAGE_SIZES;
  constructor(private authorsService: AuthorsService, private cd: ChangeDetectorRef, private router: Router,
     private route: ActivatedRoute, private messageService: ToastMessageService) { }


  ngOnInit(): void {
    this.onQueryParamsChange(this.route.snapshot.queryParams);
    this.route.queryParams.subscribe(params=>{
      this.onQueryParamsChange(params);
    })
  }

  public get editorVisibility(): boolean{
    return this.editingAuthor != undefined;
  }
  public set editorVisibility(value: boolean){
    if(!value) this.editingAuthor = undefined;
  }

  public trackAuthorById(index: number, value: Author): number{
    return value.id;
  }

  public newAuthorClicked(){
    this.creatorVisibility = true;
    this.cd.markForCheck();
  }

  public onAuthorChanged(changedAuthor: Author){
    if(!this.response) return;
    let index = this.response.result.findIndex(author=>author.id===changedAuthor.id);
    if(index < 0) return;
    this.response.result[index] = changedAuthor;
    this.cd.markForCheck();
  }

  public deleteSelectedAuthor(){
    if(!this.authorToDelete) return;
    this.waitingForResponse = true;
    this.deleteDialogVisibility = false;
    this.authorsService.deleteAuthorById(this.authorToDelete.id).subscribe(()=>{
      this.messageService.showMessage({severity: "success", summary:"Sukces", detail: "Autor usunięty"});
      this.afterRequestFinished();
      this.reloadAuthors(this.params);
    }, error=>{
      let details = error.error.info ? error.error.info: "Nie udało się usunąć autora";
      this.messageService.showMessage({severity: "success", summary:"Niepowodzenie", detail: details});
      this.afterRequestFinished();
    });
    this.cd.markForCheck();
  }

  public deleteClicked(author: Author){
    this.authorToDelete = author;
    this.deleteDialogVisibility = true;
    this.cd.markForCheck();
  }

  public setEditingAuthor(author: Author){
    this.editingAuthor = author;
    this.cd.markForCheck();
  }

  public showFilters(){
    this.filtersVisibility = true;
    this.cd.markForCheck();
  }

  public onQueryParamsChange(params: Params | GetAuthorsParams){
    this.params = Object.assign({}, DEFAULT_AUTHORS_PARAMS);
    this.params = Object.assign(this.params, params);
    if(!this.pageSizes.includes(+params.pageSize))
      this.params.pageSize = DEFAULT_PAGEABLE.pageSize;
    this.reloadAuthors(this.params);
  }

  public validateParams(params: Params | GetAuthorsParams): boolean{
    return this.pageSizes.includes(params.pageSize);
  }

  public onModelChange(){
    this.navigateToParams();
  }

  public cancelRequest(){
    this.currentRequest?.unsubscribe();
  }

  public navigateToParams(skipLocationChange: boolean = false){
    const params = Object.assign({}, this.params);
    if(params.pageSize === DEFAULT_PAGEABLE.pageSize) params.pageSize = undefined;
    if(params.pageNumber === DEFAULT_PAGEABLE.pageNumber) params.pageNumber = undefined;
    if(params.searchPhrase?.length === 0) params.searchPhrase = undefined;
    this.router.navigate([], {queryParams: params, relativeTo: this.route, skipLocationChange: skipLocationChange});
  }

  reloadAuthors(params: Params = this.params){
    this.currentRequest?.unsubscribe();
    // this.waitingForResponse = true;
    this.cd.markForCheck();
    this.currentRequest = this.authorsService.getAuthors(params).subscribe(response=>{
      this.response = response;
      this.response.totalPages = Math.max(1, this.response.totalPages);
      this.params = Object.assign(this.params, params);
      this.params.pageNumber = Math.min(response.pageNumber, response.totalPages);
      if(this.params.pageSize) this.params.pageSize = +this.params.pageSize;

      this.navigateToParams();
      this.afterRequestFinished();
      this.cd.markForCheck();
    }, error=>{
      this.params = DEFAULT_AUTHORS_PARAMS;
      this.afterRequestFinished();
      this.navigateToParams(true);
    })
  }

  public afterRequestFinished(){
    this.waitingForResponse = false;
    this.cd.markForCheck();
  }

}
