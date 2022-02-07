import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'shop-not-found',
  template: `
    <shop-wildcart></shop-wildcart>
  `,
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
