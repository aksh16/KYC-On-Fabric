/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserResultService } from './UserResult.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-userresult',
  templateUrl: './UserResult.component.html',
  styleUrls: ['./UserResult.component.css'],
  providers: [UserResultService]
})
export class UserResultComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  userid = new FormControl('', Validators.required);
  filetype = new FormControl('', Validators.required);
  filehash = new FormControl('', Validators.required);
  timestamp = new FormControl('', Validators.required);
  bank = new FormControl('', Validators.required);

  constructor(public serviceUserResult: UserResultService, fb: FormBuilder) {
    this.myForm = fb.group({
      userid: this.userid,
      filetype: this.filetype,
      filehash: this.filehash,
      timestamp: this.timestamp,
      bank: this.bank
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceUserResult.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.kyc.network.UserResult',
      'userid': this.userid.value,
      'filetype': this.filetype.value,
      'filehash': this.filehash.value,
      'timestamp': this.timestamp.value,
      'bank': this.bank.value
    };

    this.myForm.setValue({
      'userid': null,
      'filetype': null,
      'filehash': null,
      'timestamp': null,
      'bank': null
    });

    return this.serviceUserResult.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'userid': null,
        'filetype': null,
        'filehash': null,
        'timestamp': null,
        'bank': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.kyc.network.UserResult',
      'filetype': this.filetype.value,
      'filehash': this.filehash.value,
      'timestamp': this.timestamp.value,
      'bank': this.bank.value
    };

    return this.serviceUserResult.updateAsset(form.get('userid').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceUserResult.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceUserResult.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'userid': null,
        'filetype': null,
        'filehash': null,
        'timestamp': null,
        'bank': null
      };

      if (result.userid) {
        formObject.userid = result.userid;
      } else {
        formObject.userid = null;
      }

      if (result.filetype) {
        formObject.filetype = result.filetype;
      } else {
        formObject.filetype = null;
      }

      if (result.filehash) {
        formObject.filehash = result.filehash;
      } else {
        formObject.filehash = null;
      }

      if (result.timestamp) {
        formObject.timestamp = result.timestamp;
      } else {
        formObject.timestamp = null;
      }

      if (result.bank) {
        formObject.bank = result.bank;
      } else {
        formObject.bank = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'userid': null,
      'filetype': null,
      'filehash': null,
      'timestamp': null,
      'bank': null
      });
  }

}
