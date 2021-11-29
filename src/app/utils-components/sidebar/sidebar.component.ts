import { state, style, trigger, transition, animate } from '@angular/animations';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef, HostBinding, HostListener, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'shop-sidebar',
  template: `
    <div class="overlay" *ngIf = "this.visible" @darkening></div>
    <div class="sidebar" [@transition] = "this.visible ? 'showed' : 'hidden'"
     [ngStyle]="{'width': this.currentWidth}" #sidebar>
      <div class="sidebar__top">
        <i class="pi pi-times" (click) = "this.hideSidebar()"></i>
      </div>
      <div class="sidebar__content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  animations:[
    trigger("transition", [
      state("hidden", style({transform: 'translateX(-100%)'})),
      state("showed", style("*")),
      transition("showed <=> hidden", animate("300ms ease"))
    ]),
    trigger("darkening",[
      state("void", style({'opacity': 0})),
      state("*", style("*")),
      transition("void <=> *", animate("300ms ease"))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() width: number = 400;
  @ViewChild("sidebar") sidebarDiv?: ElementRef<HTMLDivElement>;

  public currentWidth: string = `${this.width}px`;


  constructor(private breakpointObserver: BreakpointObserver, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.breakpointObserver
      .observe([`(max-width: ${this.width}px)`])
      .subscribe((state: BreakpointState)=>{
        if(state.matches && this.currentWidth!="100%"){
          this.currentWidth = "100%";
          this.cd.markForCheck();
        }
        else if(this.currentWidth != `${this.width}px`){
          this.currentWidth = `${this.width}px`;
          this.cd.markForCheck();
        }
      })
  }


  @HostListener("click", ["$event"])
  public hideOnClickOutside(event: MouseEvent) {
    if(!this.sidebarDiv || !this.visible) return;
    if ((!this.sidebarDiv.nativeElement.contains(event.target as Node) && this.sidebarDiv.nativeElement !== event.target)) {
      event.stopPropagation();
      this.hideSidebar();
    }
  }
  
  public hideSidebar(){
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.cd.markForCheck();
  }

}
