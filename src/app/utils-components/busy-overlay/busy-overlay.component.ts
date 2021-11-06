import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'shop-busy-overlay',
  template: `
    <i class="pi pi-spinner pi-spin"></i>
  `,
  styleUrls: ['./busy-overlay.component.scss'],
})
export class BusyOverlayComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
