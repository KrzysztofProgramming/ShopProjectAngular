import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'shop-busy-overlay',
  template: `
  <div class="overlay" [ngClass]="{'overlay--light': overlayStyle === 'light', 'overlay--dark': overlayStyle === 'dark'}">
    <i class="pi pi-spinner pi-spin"></i>
  </div>
  `,
  styleUrls: ['./busy-overlay.component.scss'],
})
export class BusyOverlayComponent implements OnInit {
  @Input() overlayStyle: 'dark' | 'light' = "dark";

  constructor() { }

  ngOnInit(): void {
  }

}
