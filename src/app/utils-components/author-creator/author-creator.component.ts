import { finalize } from 'rxjs/operators';
import { Author } from './../../models/models';
import { ToastMessageService } from './../../services/utils/toast-message.service';
import { AuthorRequest } from './../../models/requests';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { AuthorsService } from 'src/app/services/http/authors.service';

@Component({
  selector: 'shop-author-creator',
  template: `
    <shop-dialog [(visibility)]="this._visibility" (visibilityChange)="this.visibilityChange.emit($event)"
    dialogTitle = "Nowy autor" acceptPhrase="Zapisz" denyPhrase="Odrzuć" (accept)="this.onSubmit()"
    [busyOverlay]="this.waitingForResponse">
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
export class AuthorCreatorComponent implements OnInit {
  @Input("visibility") _visibility: boolean = false;
  @Output() visibilityChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() authorAdded: EventEmitter<Author> = new EventEmitter<Author>();

  private set visibility(value: boolean){
    this._visibility = value;
    this.visibilityChange.emit(value);
  }

  private get visibility(): boolean{
    return this._visibility;
  }

  public waitingForResponse: boolean = false;

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
  }

  public onSubmit(){
    if(this.formGroup.invalid) return;
    this.sendRequest();
  }

  private sendRequest(){
    this.waitingForResponse = true;
    this.authorsService.newAuthor(this.toRequest()).pipe(
      finalize(this.requestFinished.bind(this))
    ).subscribe(this.requestSuccess.bind(this), this.requestFailed.bind(this));
    this.cd.markForCheck();
  }

  private requestSuccess(author: Author){
    this.messageService.showMessage({severity: "success", summary:"Sukces", detail: "Autor został dodany"});
    this.authorAdded.emit(author);
    this.visibility = false;
    this.formGroup.reset();
  }

  private requestFailed(error: any){
    let details = error.error.info ? error.error.info : "Nie udało się dodać autora";
    this.messageService.showMessage({severity: "error", summary:"Niepowodzenie", detail: details});
    this.nameControl.setValue("");

  }

  private requestFinished(){
    this.waitingForResponse = false;
    this.cd.markForCheck();
  }

  private toRequest(): AuthorRequest{
    return {
      name: this.nameControl.value,
      description: this.nameControl.value ? this.nameControl.value : ""
    }
  }

}
