import { finalize } from 'rxjs/operators';
import { Author } from '../../../models/models';
import { ToastMessageService } from '../../../services/utils/toast-message.service';
import { AuthorRequest } from '../../../models/requests';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AuthorsService } from 'src/app/services/http/authors.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'shop-author-creator',
  template: `
    <shop-dialog [(visibility)]="this._visibility" (visibilityChange)="this.visibilityChange.emit($event)"
    [dialogTitle] = "this.author ? 'Edytuj autora' : 'Nowy autor'" acceptPhrase="Zapisz" denyPhrase="Odrzuć" (accept)="this.onSubmit()"
    [busyOverlay]="this.waitingForResponse" [acceptDisabled]="this.formGroup.invalid" (deny)="this.visibility = false">
    <form class="content" [formGroup]="this.formGroup" (ngSubmit)="this.onSubmit()">
      <input placeholder = "imię" class="content__name content__element" type="text" shopInputText formControlName = "name"
      [invalid] = "this.nameControl.invalid && this.nameControl.touched">
      <textarea placeholder = "opis (opcjonalnie)" shopInputText class="content__description content__element" formControlName = "description"></textarea>
    </form>
    </shop-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./author-creator.component.scss']
})
export class AuthorCreatorComponent implements OnInit, OnDestroy {
  // @Input("visibility")
  public author?: Author;

  @Input("author")
  public set authorInput(value: Author | undefined){
    if(value==undefined){
      this.formGroup.reset();
      this.cd.markForCheck();
      return;
    }
    this.author = value;
    this.nameControl.setValue(value.name);
    this.descriptionControl.setValue(value.description);
    this.cd.markForCheck();
  }
  public get authorInput(): Author | undefined{
    return this.author;
  }

  _visibility: boolean = false;
  public waitingForResponse: boolean = false;
  private subscriptions: Subscription[] = [];

  @Input("visibility")
  public set visibilityInput(value: boolean){
    this._visibility = value;
    if(!this._visibility) this.resetForm();
  }
  public get visibilityInput(): boolean{
    return this._visibility;
  }

  @Output() visibilityChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() authorAdded: EventEmitter<Author> = new EventEmitter<Author>();

  public set visibility(value: boolean){
    this._visibility = value;
    this.visibilityChange.emit(value);
  }

  public get visibility(): boolean{
    return this._visibility;
  }

  constructor(private fb: FormBuilder, private authorsService: AuthorsService, private cd:ChangeDetectorRef,
    private messageService: ToastMessageService) { }

  
  formGroup: FormGroup = this.fb.group({
    "name": ["", [Validators.required]],
    "description": ["", []]
  })

  get nameControl(): AbstractControl{
    return this.formGroup.get("name")!;
  }

  get descriptionControl(): AbstractControl{
    return this.formGroup.get("description")!;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.visibilityChange.subscribe(value=>{
        if(!value) this.resetForm();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }

  public resetForm(){
    this.formGroup.reset();
    this.cd.markForCheck();
  }

  public onSubmit(){
    if(this.formGroup.invalid) return;
    this.sendRequest();
  }

  private sendRequest(){
    this.waitingForResponse = true;
    if(this.author){
      this.authorsService.updateAuthor(this.author.id, this.toRequest()).pipe(
        finalize(this.requestFinished.bind(this))
        ).subscribe(this.requestSuccess.bind(this), this.requestFailed.bind(this));
    }
    else{
      this.authorsService.newAuthor(this.toRequest()).pipe(
        finalize(this.requestFinished.bind(this))
      ).subscribe(this.requestSuccess.bind(this), this.requestFailed.bind(this));
    }
    this.cd.markForCheck();
  }

  private requestSuccess(author: Author){
    let detail: string = this.author ? "Autor zmieniony" : "Autor został dodany";
    this.messageService.showMessage({severity: "success", summary:"Sukces", detail: detail});
    this.authorAdded.emit(author);
    this.visibility = false;
  }

  private requestFailed(error: any){
    let details = error.error.info ? error.error.info : this.author ? "Nide udało się edytować autora" :
     "Nie udało się dodać autora";
    this.messageService.showMessage({severity: "error", summary:"Niepowodzenie", detail: details});
    if(this.author){
      this.nameControl.setValue(this.author.name);
      this.descriptionControl.setValue(this.author.description);
    }
    else
      this.nameControl.setValue("");
  }

  private requestFinished(){
    this.waitingForResponse = false;
    this.cd.markForCheck();
  }

  private toRequest(): AuthorRequest{
    return {
      name: this.nameControl.value.trim(),
      description: this.descriptionControl.value ? this.descriptionControl.value.trim() : ""
    }
  }

}
