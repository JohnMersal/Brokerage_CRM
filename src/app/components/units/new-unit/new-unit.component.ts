import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from "rxjs";
import notify from 'devextreme/ui/notify';
import { CompoundsService } from '../../compounds/compounds.service';
import { unitsList, UnitsModel } from "../units-model";
import { UnitsService } from "../units.service";
import { DxValidationGroupComponent } from 'devextreme-angular';

@Component({
  selector: 'app-new-unit',
  templateUrl: './new-unit.component.html',
  styleUrls: ['./new-unit.component.scss']
})
export class NewUnitComponent implements OnInit {
  @Input() updateMode: boolean = false;
  @Output() afterSave = new EventEmitter();
  @ViewChild('DataValidator') DataValidator: DxValidationGroupComponent;
  unitFormGroup: FormGroup;
  singleUnit: UnitsModel = new UnitsModel();
  compoundsLookup = [];
  subscription: Subscription = new Subscription();

  constructor(private unitsSrvice: UnitsService,
              private formBuilder: FormBuilder,
              private compoundService: CompoundsService) {
    this.creatAreaForm();
    this.getCompoundsLookup();
  }
  creatAreaForm() {
    this.unitFormGroup = this.formBuilder.group({
      compound_id: ['', Validators.required],
      unit_type: ['', Validators.required],
      unit_num: ['', Validators.required],
      land_area: ['', Validators.required],
      building_area: ['', Validators.required],
      garden_area: ['', Validators.required],
      offering_type: ['', Validators.required],
      owner_name: ['', Validators.required],
      owner_phone: ['', Validators.required],
      owner_email: [''],
      owner_facebook: [''],
      bedrooms: ['', Validators.required],
      bathrooms: ['', Validators.required],
      floor_num: ['', Validators.required],
      unit_view: ['', Validators.required],
      unit_desc: ['', Validators.required],
      original_price: ['', Validators.required],
      market_price: ['', Validators.required],
      owner_price: ['', Validators.required],
      over_price: ['', Validators.required],
      commission_percentage: ['', Validators.required],
      commission_value: ['', Validators.required],
      final_price: ['', Validators.required],
      original_downpayment: ['', Validators.required],
      final_downpayment: ['', Validators.required],
    });
  }

  getCompoundsLookup() {
    this.subscription.add(this.compoundService.getAllCompounds().subscribe(
      (value: any) => {
        this.compoundsLookup = value.data;
      }, error => {
        notify("error in loading areas list.." + error.meta.message, "error");
      }));
  }

  afterSaveCompound(event) {
    this.getCompoundsLookup();
  }
  setTypeBlock(e) {
    this.singleUnit.unit_type = e.value;
    /*this.unitFormGroup.setValue({
      'compound_id': this.singleUnit.compound_id,
      'unit_type': e.value,
      'unit_num': this.singleUnit.unit_num,
      'land_area': this.singleUnit.land_area,
      'building_area': this.singleUnit.building_area,
      'garden_area': this.singleUnit.garden_area,
      'offering_type': this.singleUnit.offering_type,
      'owner_name': this.singleUnit.owner_name,
      'owner_phone': this.singleUnit.owner_phone,
      'owner_email': this.singleUnit.owner_email,
      'owner_facebook': this.singleUnit.owner_facebook,
      'bedrooms': this.singleUnit.bedrooms,
      'bathrooms': this.singleUnit.bathrooms,
      'floor_num': this.singleUnit.floor_num,
      'unit_view': this.singleUnit.unit_view,
      'unit_desc': this.singleUnit.unit_desc,
      'original_price': this.singleUnit.original_price,
      'market_price': this.singleUnit.market_price,
      'owner_price': this.singleUnit.owner_price,
      'over_price': this.singleUnit.over_price,
      'commission_percentage': this.singleUnit.commission_percentage,
      'commission_value': this.singleUnit.commission_value,
      'final_price': this.singleUnit.final_price,
      'original_downpayment': this.singleUnit.original_downpayment,
      'final_downpayment': this.singleUnit.final_downpayment,
    });*/
    //console.log(e.value, this.singleUnit.unit_type);
  }
  saveUnit() {
    console.log(this.singleUnit);
    if (this.DataValidator.instance.validate().isValid) {
      if (this.updateMode) {
      this.subscription.add(this.unitsSrvice.updateUnit(this.singleUnit).subscribe(
        (value: any) => {
          this.afterSave.emit({ id: value, data: this.singleUnit });
          notify("Unit updated successfully", "success");
          this.singleUnit = new UnitsModel();
          //this.unitFormGroup.reset();
        }, error => {
          notify("error in saving.." + error.meta.message, "error");
        }));

      } else {
      this.subscription.add(this.unitsSrvice.saveUnit(this.singleUnit).subscribe(
        (value: any) => {
          this.afterSave.emit({ id: value, data: this.singleUnit });
          notify("Unit saved successfully", "success");
          this.singleUnit = new UnitsModel();
          //this.unitFormGroup.reset();
        }, error => {
          notify("error in saving.." + error.meta.message, "error");
        }));
      }
    }
  }
  commissionChanged(whichField, e) {
    //console.log(e.value);
    /*var originalPrice = this.singleUnit.original_price;
    var percent = this.singleUnit.commission_percentage;
    var amount = this.singleUnit.commission_value;*/
    if (this.singleUnit.commission_percentage > 0 && this.singleUnit.original_price > 0) {
      if (whichField == '%') {
        this.singleUnit.commission_value = this.singleUnit.commission_percentage * this.singleUnit.original_price;
      } else if (whichField == '#') {
        this.singleUnit.commission_percentage = this.singleUnit.commission_value / this.singleUnit.original_price;
      }
      this.singleUnit.final_price = this.singleUnit.original_price + this.singleUnit.commission_value;
    }
  }
  calculateOverPrice(e) {
    if (this.singleUnit.original_price && this.singleUnit.owner_price) {
      let diff = this.singleUnit.original_price - this.singleUnit.owner_price;
      if (diff > 0) this.singleUnit.over_price = diff;
    }
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
