import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'shop-dialog',
  template: `
    <ng-container *ngIf = "this.visibility">
      <div class="wrapper">
        <div class="dialog">
          <div class="dialog__top">
            <p class="title">{{this.title}}</p>
            <i class="pi pi-times" *ngIf="this.exitButton" (click)="this.hideDialog()"></i>
          </div>
          <div class="dialog__content">
            <ng-content></ng-content>
          </div>
          <div *ngIf = "this.acceptPhrase || this.cancelPhrase || this.denyPhrase" class="dialog__bottom">
            <button shop-button></button>
          </div>
        </div>
      </div>
      <div class="overlay"></div>
    </ng-container>
  `,
  animations:[
    trigger("scaleEnter", [
      state("*", style("*")),
      state("void", style({transform: 'scale(0)'})),
      transition("void <=> *", animate("200ms ease"))
    ])
  ],
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent implements OnInit {

  @Input() acceptPhrase?: string;
  @Input() denyPhrase?: string;
  @Input() cancelPhrase?: string;
  @Input() exitButton: boolean = true;
  @Input() title: string = "zajebiście długi tytuł";
  @Input() visibility: boolean = true;
  @Output() visibilityChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public cd: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  public hideDialog(): void{
    this.visibility = false;
    this.visibilityChange.emit(this.visibility);
    this.cd.markForCheck();
  }

}
