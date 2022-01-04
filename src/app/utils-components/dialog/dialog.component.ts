import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'shop-dialog',
  template: `
    <ng-container *ngIf = "this._visibility">
      <div class="wrapper" @scaleEnter>
        <div class="dialog">
          <shop-busy-overlay *ngIf="this.busyOverlay"></shop-busy-overlay>
          <div class="dialog__top">
            <p class="title">{{this.dialogTitle}}</p>
            <i class="pi pi-times" *ngIf="this.exitButton" (click)="this.hideDialog()"></i>
          </div>
          <div class="dialog__content">
            <ng-content></ng-content>
          </div>
          <div *ngIf = "this.acceptPhrase || this.cancelPhrase || this.denyPhrase" class="dialog__bottom">
            <button *ngIf="this.acceptPhrase" shopButton [disabled] = "this.acceptDisabled" padding="medium" color="green"
            class="dialog__button dialog__button--accept" (click) = "this.onAccept()">{{acceptPhrase}}</button>
            <button *ngIf="this.denyPhrase" shopButton [disabled] = "this.denyDisabled" padding="medium" color="red"
            class="dialog__button dialog__button--deny" (click) = "this.onDeny()">{{denyPhrase}}</button>
            <button *ngIf="this.cancelPhrase" shopButton [disabled] = "this.cancelDisabled" padding="medium" color="gray"
            class="dialog__button dialog__button--cancel" (click) = "this.hideDialog()">{{cancelPhrase}}</button>
          </div>
        </div>
      </div>
      <div class="overlay" @smoothOpacity></div>
    </ng-container>
  `,
  animations:[
    trigger("scaleEnter", [
      state("*", style("*")),
      state("void", style({transform: 'scale(0)'})),
      transition("void <=> *", animate("200ms ease"))
    ]),
    trigger("smoothOpacity", [
      state("void", style({opacity: 0})),
      state("*", style("*")),
      transition("void <=> *", animate("200ms ease"))
    ])
  ],
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent implements OnInit {

  @Input() acceptPhrase?: string;
  @Input() acceptDisabled: boolean = false;
  @Input() denyPhrase?: string;
  @Input() denyDisabled: boolean = false;
  @Input() cancelPhrase?: string;
  @Input() cancelDisabled: boolean = false;
  @Input() exitButton: boolean = true;
  @Input() dialogTitle?: string;
  @Input() busyOverlay: boolean = false;
  @Output() visibilityChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() accept: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() deny: EventEmitter<void> = new EventEmitter<void>();

  @Input()
  get visibility(): boolean{
    return this._visibility;
  }
  set visibility(value: boolean){
    this._visibility = value;
    this.lockUnlockScrolling();
  }
  
  _visibility: boolean = true;

  constructor(public cd: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  public lockUnlockScrolling(){
    if(this._visibility){
      document.body.style.overflow = 'hidden';
    }
    else{
      document.body.style.overflow = 'auto';
    }
  }

  public onDeny(): void{
    this.deny.emit();
  }

  public onAccept(): void{
    this.accept.emit();
  }

  // public onCancelled(): void{
  //   this.cancel.emit();
  // }

  public emitVisibilityEvent(){
    this.visibilityChange.emit(this._visibility);
    this.lockUnlockScrolling();
  }

  public hideDialog(): void{
    this.cancel.emit();
    this._visibility = false;
    this.emitVisibilityEvent();
    this.cd.markForCheck();
  }


}
