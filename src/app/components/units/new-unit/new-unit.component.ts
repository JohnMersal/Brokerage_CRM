import {Component, OnInit, Output, EventEmitter, ViewChild, Input, OnDestroy} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import notify from 'devextreme/ui/notify';
import { CompoundsList } from '../../compounds/compounds';
import { CompoundsService } from '../../compounds/compounds.service';
import { AreasList } from '../../areas/areas-model';
import { AreasService } from '../../areas/areas.service';
import { unitsList, UnitsModel } from '../units-model';
import { UnitsService } from '../units.service';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { NotifierService } from 'angular-notifier';
import {Router} from '@angular/router';
declare var jQuery: any;

export interface UnitType {
  name: string;
  icon: string;
}

@Component({
  selector: 'app-new-unit',
  templateUrl: './new-unit.component.html',
  styleUrls: ['./new-unit.component.scss']
})
export class NewUnitComponent implements OnInit, OnDestroy {
  private notifier: NotifierService;
  @Input() updateMode = false;
  @Output() afterSave = new EventEmitter();

  @ViewChild('DataValidator') DataValidator: DxValidationGroupComponent;
  unitFormGroup: FormGroup;
  singleUnit: UnitsModel = new UnitsModel();
  compoundsLookup: CompoundsList[] = [];
  compoundFilteredList: CompoundsList[] = [];
  areasLookup: AreasList[] = [];
  subscription: Subscription = new Subscription();
  unitNotValidated = false;
  compoundNotValidated = false;
  disableAreaValidationError = true;
  selectedArea;
  resetAreaSearch = false;
  commissionValueConstant = '';

  // unitTypes List
  unitTypes: UnitType[] = [
    {name: 'Apartment', icon: 'icon-apartment'},
    {name: 'Standalone', icon: 'icon-chalet'},
    {name: 'Townhouse', icon: 'icon-townhouse'},
    {name: 'Twin villa', icon: 'icon-twin-villa'},
    {name: 'Other', icon: 'icon-twin-villa'},
  ];


  constructor(private unitsSrvice: UnitsService,
              private formBuilder: FormBuilder,
              notifier: NotifierService,
              private router: Router,
              private compoundService: CompoundsService,
              private areasService: AreasService) {
    this.creatAreaForm();
    this.getAreasLookup();
    this.getCompoundsLookup();
    this.notifier = notifier;
  }
  creatAreaForm() {
    this.unitFormGroup = this.formBuilder.group({
      owner_name: [''],
      owner_phone: [''],
      compound_id: [''],
      unit_type: [''],
      unit_num: [''],
      land_area: [''],
      building_area: [''],
      garden_area: [''],
      offering_type: [''],
      owner_email: [''],
      owner_facebook: [''],
      bedrooms: [''],
      bathrooms: [''],
      floor_num: [''],
      unit_view: [''],
      unit_desc: [''],
      original_price: [''],
      market_price: [''],
      owner_price: [''],
      over_price: [''],
      commission_percentage: [''],
      commission_value: [''],
      final_price: [''],
      original_downpayment: [''],
      final_downpayment: [''],
    });
  }
  getCompoundsLookup() {
    this.subscription.add(this.compoundService.getAllCompounds().subscribe(
      (value: any) => {
        this.compoundsLookup = value.data;
      }, error => {
        notify('error in loading compounds list..', 'error');
    }));
  }

  // Changes unit Type FORM using top selectors
  setunitType(btn: string) {
    this.singleUnit.unit_type = btn;
    this.unitNotValidated = false;
  }
  setcompName(name: number) {
    this.singleUnit.compound_id = name;
    this.compoundNotValidated = false;
  }
  selectArea(e, timeout?) {
    this.compoundFilteredList = this.compoundsLookup.filter(x => x.area.id == e);
    this.selectedArea = e;
    this.disableAreaValidationError = false;
    // For refreshing the compound LIST
    setTimeout(() => {
      if (timeout) {
        this.compoundFilteredList = this.compoundsLookup.filter(x => x.area.id == e);
      }
    }, 1000);
  }

  getAreasLookup() {
    this.subscription.add(this.areasService.getAllAreas().subscribe(
      (value: any) => {
        this.areasLookup = value.data;
      }, error => {
        notify('error in loading areas list..', 'error');
    }));

  }
  openAddNewModel(name: string) {
    if (name == 'area') {
      (jQuery('#addNewAreaModal') as any).modal('show');
    } else if (name == 'compound') {
      this.resetAreaSearch = true;
      this.getAreasLookup();
      (jQuery('#addNewCompoundModal') as any).modal('show');
    }
  }
  afterSaveCompound(event) {
    this.getCompoundsLookup();
    (jQuery('#addNewCompoundModal') as any).modal('hide');
    this.resetAreaSearch = false;
  }
  afterSaveArea(event) {
    this.getAreasLookup();
    (jQuery('#addNewAreaModal') as any).modal('hide');
  }
  setTypeBlock(e) {
    this.singleUnit.unit_type = e.value;
  }

  saveUnit(reset?) {
    // reset returns true or false value and is optional
    // ===========================
    // Custom Validation for Unit and compound
    if (!this.singleUnit.unit_type){
      this.unitNotValidated = true;
      this.notifier.notify('error', 'unittype error in validation, please check the form again and fix highlighted inputs');
      // notify('error in validation, please check the form again and fix highlighted inputs');
    }
    if (!this.singleUnit.compound_id){
      this.compoundNotValidated = true;
      this.notifier.notify('error', 'area error in validation, please check the form again and fix highlighted inputs');
    }
    // End Custom Validation for Unit and Compound controllers
    // ===========================
    // console.log(this.singleUnit);
    if (this.DataValidator.instance.validate().isValid) {
      if (this.updateMode) {
      this.subscription.add(this.unitsSrvice.updateUnit(this.singleUnit).subscribe(
        (value: any) => {
          this.afterSave.emit({ id: value, data: this.singleUnit });
          notify('Unit updated successfully', 'success');
          if (reset) {
            // resets units Module
            this.singleUnit = new UnitsModel();
            // resets Area toggle group
            this.selectedArea = undefined;
            // Scrolls window to top to refill the form
            window.scroll({top: 0});
          } else {
            this.router.navigate(['units']);
          }
        }, error => {
          notify('error in saving..' + error.meta.message, 'error');
        }));

      } else {
        this.subscription.add(this.unitsSrvice.saveUnit(this.singleUnit).subscribe(
        (value: any) => {
          this.afterSave.emit({ id: value, data: this.singleUnit });
          notify('Unit saved successfully', 'success');
          this.singleUnit = new UnitsModel();
          // this.unitFormGroup.reset();
        }, error => {
            this.notifier.notify('error', 'error in validation,' + error.meta.message + 'please check the form again and fix highlighted inputs');
            // notify('error in saving..' + error.meta.message, 'error');
        }));
      }
    }
  }


  // Calculator Functions
  updateCommissionValue(e){
    // Updates commission inputs if the asking price by owner is updated
    if (this.singleUnit.commission_percentage > 0 && this.singleUnit.commission_value > 0) {
      // this commission value constant determines if the user used the # or % inputs to make it constant and change the other
      if (this.commissionValueConstant === '#') {
        this.singleUnit.commission_value =
          this.singleUnit.commission_percentage *
          this.singleUnit.owner_price;
      } else if (this.commissionValueConstant === '%') {
        this.singleUnit.commission_percentage =
          this.singleUnit.commission_value /
          this.singleUnit.owner_price;
      }
    }
  }
  commissionChanged(whichField, e) {
    // asking price by owner * commission percentage
    if (this.singleUnit.commission_percentage > 0 && this.singleUnit.owner_price > 0) {
      if (whichField == '%') {
        this.commissionValueConstant = '%';
        this.singleUnit.commission_value =
          this.singleUnit.commission_percentage *
          this.singleUnit.owner_price;
      } else if (whichField == '#') {
        this.commissionValueConstant = '#';
        this.singleUnit.commission_percentage =
          this.singleUnit.commission_value /
          this.singleUnit.owner_price;
      }
    }
  }

  calculateAskingPriceByOwner(e){
    if (this.singleUnit.original_price && this.singleUnit.over_price) {
      // OriginalPrice + OverPrice
      this.singleUnit.owner_price =
        this.singleUnit.original_price +
        this.singleUnit.over_price;
    }
  }
  calculateFinalPrice(e){
    if (this.singleUnit.owner_price && this.singleUnit.commission_value) {
      // Asking price by Owner + commission value
      this.singleUnit.final_price =
        this.singleUnit.owner_price +
        this.singleUnit.commission_value;
    }
  }
  calculateFinalDownPayment(e){
    if (this.singleUnit.original_downpayment && this.singleUnit.over_price && this.singleUnit.commission_value) {
      // original downpayment + overprice + commission value
      this.singleUnit.final_downpayment =
        this.singleUnit.original_downpayment +
        this.singleUnit.over_price +
        this.singleUnit.commission_value ;
    }
  }


  ngOnInit() {}
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
