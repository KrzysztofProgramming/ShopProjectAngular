import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[shopNavButton]',
  host:{
    '[class.d-nav-button]': 'true',
    '[class.d-nav-button-clicked]': 'lastClicked'
  }
})
export class NavButtonDirective {
  lastClicked: boolean = false;

  @HostListener("document:click", ['$event'])
  public onClickHandler(event: MouseEvent){
    this.lastClicked = this.eref.nativeElement.contains(event.target);
  }

  constructor(private eref: ElementRef) { }

}
