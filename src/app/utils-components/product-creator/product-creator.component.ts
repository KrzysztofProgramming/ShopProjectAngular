import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { notEmptyListValidator } from 'src/app/models/shop-validators';
import { AuthorsSelectComponent } from '../authors-select/authors-select.component';
import { TypesSelectComponent } from '../types-select/types-select.component';

@Component({
  selector: 'app-product-creator',
  templateUrl: './product-creator.component.html',
  styleUrls: ['./product-creator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCreatorComponent implements OnInit {
  

  public authorCreatorVisibility: boolean = false;
  public typeCreatorVisibility: boolean = false;
  
  @ViewChild("authorsSelect")
  private authorsSelect?: AuthorsSelectComponent;

  @ViewChild("typesSelect")
  private typesSelect?: TypesSelectComponent;

  public formGroup: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    categories: [[], notEmptyListValidator],
    description: ['', Validators.required],
    inStock: [0, [Validators.required, Validators.min(0)]],
    authors: [[], notEmptyListValidator]
  })

  constructor(private cd: ChangeDetectorRef, private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  get authorsControl(): AbstractControl{
    return this.formGroup.get("authors")!;
  }

  get inStockControl(): AbstractControl{
    return this.formGroup.get("inStock")!;
  }

  get categoriesControl(): AbstractControl{
    return this.formGroup.get("categories")!
  }

  get nameControl(): AbstractControl{
    return this.formGroup.get("name")!
  }

  get priceControl(): AbstractControl{
    return this.formGroup.get("price")!
  }

  get descriptionControl(): AbstractControl{
    return this.formGroup.get("description")!;
  }

  public refreshAuthorsSelect(){
    this.authorsSelect?.refreshAuthors();
  }

  public refreshTypesSelect(){
    this.typesSelect?.refreshTypes();
  }

  public showAuthorCreator(){
    this.authorCreatorVisibility = true;
    this.cd.markForCheck();
  }

  public showTypeCreator(){
    this.typeCreatorVisibility = true;
    this.cd.markForCheck();
  }
}
