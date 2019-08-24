import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from "rxjs";
import { AreasList, AreasModel } from "../areas-model";
import { AreasService } from "../areas.service";
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-new-areas',
  templateUrl: './new-areas.component.html',
  styleUrls: ['./new-areas.component.scss']
})
export class NewAreasComponent implements OnInit {
  @Output() afterSave = new EventEmitter();
  areaFormGroup: FormGroup;
  singleArea: AreasModel = new AreasModel();
  subscription: Subscription = new Subscription();
  constructor(private areasSrvice: AreasService, private formBuilder: FormBuilder, private snackBar: MatSnackBar) {
    this.creatAreaForm();
   }
  creatAreaForm() {
    this.areaFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
    });
  }
  saveArea() {
    if (this.areaFormGroup.valid) {
      this.subscription.add(this.areasSrvice.saveArea(this.singleArea).subscribe(
        (value: any) => {
          this.afterSave.emit({ id: value, data: this.singleArea });
          this.snackBar.open("Lead saved successfully", "OK", { duration: 2000, politeness: "polite" });
          this.singleArea = new AreasModel();
          this.areaFormGroup.reset();
        }, error => {
          this.snackBar.open("error in saving.." + error.error, "", { duration: 2000, politeness: "polite" });
        }));
    }
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
