import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from "rxjs";
import { ClientsList, ClientsModel } from "../clients-model";
import { ClientService } from "../client.service";
import { MatSnackBar } from '@angular/material';
import { AreasService } from '../../areas/areas.service';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss']
})
export class NewClientComponent implements OnInit {
  @Output() afterSave = new EventEmitter();
  clientFormGroup: FormGroup;
  singleClient: ClientsModel = new ClientsModel();
  areasLookup = [];
  subscription: Subscription = new Subscription();
  constructor(private clientsSrvice: ClientService, private formBuilder: FormBuilder, private snackBar: MatSnackBar, private areasService: AreasService) {
    this.creatAreaForm();
  }
  creatAreaForm() {
    this.clientFormGroup = this.formBuilder.group({
      first_name: ['', Validators.required],
      second_name: ['', Validators.required],
      email: ['', ],
      mobile: ['', Validators.required],
      gender: ['', Validators.required],
      budget_from: ['', Validators.required],
      budget_to: ['', Validators.required],
      request_type: ['', Validators.required],
    });
  }
  saveClient() {
    if (this.clientFormGroup.valid) {
      this.subscription.add(this.clientsSrvice.saveClient(this.singleClient).subscribe(
        (value: any) => {
          this.afterSave.emit({ id: value, data: this.singleClient });
          this.snackBar.open("Client saved successfully", "OK", { duration: 2000, politeness: "polite" });
          this.singleClient = new ClientsModel();
          this.clientFormGroup.reset();
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
