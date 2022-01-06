import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHideOnScrollDown]',
  animations: []
})
export class HideOnScrollDownDirective {

  constructor(eref: ElementRef, private) { }

  public lastScrollTop: number = 0;
  public hideSearchBar: boolean = false;

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

}
