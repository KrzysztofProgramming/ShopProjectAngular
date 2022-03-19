import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, HostListener, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'shop-scroller',
  template: `
    <div class="scroll-button" @opacityEntry *ngIf="this.lastScrollTop > 50" (click)="this.scrollUp()">
      <i class="pi pi-arrow-up"></i>
    </div>
  `,
  styleUrls: ['./scroller.component.scss'],
  animations:[
    trigger("opacityEntry", [
      state("void", style({"opacity": 0})),
      state("*", style("*")),
      transition("void <=> *", animate("200ms ease"))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollerComponent implements OnInit {

  constructor(private cd: ChangeDetectorRef) { }

  public lastScrollTop: number = 0;

  @HostListener("window:scroll", ["$event"])
  public onScrollListener(event: Event){
    const newScrollTop = window.scrollY || document.documentElement.scrollTop;
    this.lastScrollTop = newScrollTop;
    this.cd.markForCheck();
  }

  ngOnInit(): void {
  }

  public scrollUp(){
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }

}
