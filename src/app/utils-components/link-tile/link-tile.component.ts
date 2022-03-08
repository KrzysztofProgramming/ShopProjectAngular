import { Component, HostBinding, Input, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'shop-link-tile',
  template: `
  <div class="image" [ngStyle]="{'background-image': 'url(\\'' + this.src + '\\')'}">
    <div class="content" >
      <ng-content></ng-content>
    </div>
  </div>
  `,
  styleUrls: ['./link-tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkTileComponent implements OnInit {

  @HostBinding("style.background-image")
  src: string = "../../../assets/img/empty-image.png";
  
  @Input("imgName")
  public set imgNameInput(value: string){
    this.src = `../../../assets/img/${value}`;
    this.cd.markForCheck();
  }
  public get imageNameInput(): string{
    return this.src.substring(this.src.lastIndexOf('/') + 1);
  }

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

}
