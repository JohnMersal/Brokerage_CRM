import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from "rxjs";
import notify from 'devextreme/ui/notify';
import { CompoundsList, CompoundModel } from "../compounds";
import { CompoundsService } from "../compounds.service";
//import { MatSnackBar } from '@angular/material';
import { AreasService } from '../../areas/areas.service';

@Component({
  selector: 'app-new-compounds',
  templateUrl: './new-compounds.component.html',
  styleUrls: ['./new-compounds.component.scss']
})
export class NewCompoundsComponent implements OnInit {
  @Output() afterSave = new EventEmitter();
  compoundFormGroup: FormGroup;
  singleCompound: CompoundModel = new CompoundModel();
  areasLookup = [];
  subscription: Subscription = new Subscription();
  constructor(private areasSrvice: CompoundsService, private formBuilder: FormBuilder, private areasService: AreasService) {
    this.creatAreaForm();
    this.getAreasLookup();
  }
  creatAreaForm() {
    this.compoundFormGroup = this.formBuilder.group({
      area_id: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required],
    });
  }
  getAreasLookup() {
    this.subscription.add(this.areasService.getAllAreas().subscribe(
      (value: any) => {
        this.areasLookup = value.data;
      }, error => {
        notify(error.error, "error");
      }));
  }
  saveCompound() {
    if (this.compoundFormGroup.valid) {
      this.subscription.add(this.areasSrvice.saveCompound(this.singleCompound).subscribe(
        (value: any) => {
          this.afterSave.emit({ id: value, data: this.singleCompound });
          notify("Compound saved successfully", "success");
          this.singleCompound = new CompoundModel();
          this.compoundFormGroup.reset();
        }, error => {
          notify("error in saving.." + error.error, "error");
        }));
    }
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
