import { Component, OnInit } from '@angular/core';
import { TreeItem } from 'src/app/utils-components/tree-menu/tree-menu.component';

@Component({
  selector: 'app-profile-orders',
  templateUrl: './profile-orders.component.html',
  styleUrls: ['./profile-orders.component.scss']
})
export class ProfileOrdersComponent implements OnInit {
  
  public treeItems: TreeItem[] =[
    {
      label: "siema",
    },
    {
      label: "elo",
      items: [
        {
          label: "bounjour",
          items: [
            {label: "asdasd"},
            {label: "asdadsas"}
          ]
        },
        {
          label: "aloha"
        }
      ]
    },
    {
      label:"zajebiscie"
    },{
      label: "kozak",
      items: [
        {
          label: "OP",
          items:[
            {
              label: "busted",
              items:[
                {label: "insane"},
                {label: "best"},
                {label: "invincible"}
              ]
            },
          ]
        },
        {
          label: "great",
          items:[
            {
              label: "awesome",
            },
            {
              label: "perfect"
            }
          ]
        },
        {
          label: "Overpowered"
        }
      ]
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
