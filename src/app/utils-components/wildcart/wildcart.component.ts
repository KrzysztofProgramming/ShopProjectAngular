import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'shop-wildcart',
  template: `
    <h2 class="header">Przykro nam, strona której szukasz nie istnieje</h2>
    <img class="image" src="../../../assets/img/notFound.svg">
    <p class="info">Zobacz co mamy w naszej ofercie</p>
    <button shopButton (click) = "this.navigateToOffert()">Oferta</button>
  `,
  styleUrls: ['./wildcart.component.scss']
})
export class WildcartComponent implements OnInit {



  constructor(private router: Router) { }

  public navigateToOffert(){
    this.router.navigate(['/offert']);
  }

  ngOnInit(): void {
  }

}
