import { Component, OnInit } from '@angular/core';
import { ListElement } from 'src/app/utils-components/selectable-list/selectable-list.component';

@Component({
  selector: 'app-profile-opinions',
  templateUrl: './profile-opinions.component.html',
  styleUrls: ['./profile-opinions.component.scss']
})
export class ProfileOpinionsComponent implements OnInit {

  checkboxValue: boolean = true;

  public list: ListElement[] = [
    {label: "siema",},
  {
    label: "zajebioza",
  }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
