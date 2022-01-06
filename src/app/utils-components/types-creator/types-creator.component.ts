import { FormControl, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ProductsService } from 'src/app/services/http/products.service';
import { ToastMessageService } from 'src/app/services/utils/toast-message.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'shop-types-creator',
  template: `
    <shop-dialog acceptPhrase="OK" denyPhrase="Anuluj" dialogTitle="Stwórz nowy typ" [(visibility)]="this._visibility"
    (visibilityChange)="this.visibilityChange.emit($event)" (accept)="this.onSubmit()" [busyOverlay]="this.waitingForResponse">
      <form class="content" (ngSubmit)="this.onSubmit()">
        <input class="content__input" placeholder="nazwa" shopInputText [formControl] = "this.typeControl">
      </form>
    </shop-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./types-creator.component.scss']
})
export class TypesCreatorComponent implements OnInit {
  
  @Input("visibility") _visibility: boolean = false;
  @Output() visibilityChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() typeAdded: EventEmitter<string> = new EventEmitter<string>();
  public waitingForResponse: boolean = false;

  public get visibility(): boolean{
    return this._visibility;
  }
  private set visibility(value: boolean){
    this._visibility = value;
    this.visibilityChange.emit(value);
  }

  typeControl: FormControl = new FormControl("", [Validators.required]);
  
  constructor(private productsService: ProductsService, private cd: ChangeDetectorRef, private messageService: ToastMessageService) { }

  ngOnInit(): void {
  }

  public onSubmit(){
    if(this.typeControl.invalid) return;
    this.sendRequest();
  }

  private sendRequest(){
    this.waitingForResponse = true;
    this.productsService.addType(this.typeControl.value).pipe(
      finalize(this.requestFinished.bind(this))
    ).subscribe(this.requestSuccess.bind(this), this.requestFailed.bind(this));
    this.cd.markForCheck();
  }

  private requestSuccess(typeName: string){
    this.messageService.showMessage({severity: "success", summary:"Sukces", detail: "Typ został dodany"});
    this.typeAdded.emit(typeName);
    this.visibility = false;
    this.typeControl.reset();
  }

  private requestFailed(error: any){
    let details = error.error.info ? error.error.info : "Nie udało się dodać typu";
    this.messageService.showMessage({severity: "error", summary:"Niepowodzenie", detail: details});
    this.typeControl.setValue("");
  }

  private requestFinished(){
    this.waitingForResponse = false;
    this.cd.markForCheck();
  }

}
