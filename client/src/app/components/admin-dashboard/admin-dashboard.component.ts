import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder } from '@angular/forms';
import { API_TOKENS } from 'src/app/mock-tokens';
import { TokensDatasourceService } from '../../services/tokens-datasource.service';
import { ApiToken, TokenStatus } from '../../api-token';

import { ApiTokenService } from '../../services/api-token.service';
import { MatSelectionListChange } from '@angular/material/list';

//For testing purpose only
//import { API_TOKENS } from '../../mock-tokens';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  apiTokens: ApiToken[] = [];
  selectedApiToken: string = "";
  hideRevokeButton: boolean = true;
  hideEnableButton: boolean = true;
  hideDeleteButton: boolean = true;

  //Inject the ApiTokenService
  constructor(private tokenService: ApiTokenService, private formBuilder: FormBuilder) { }

  tokenListForm = this.formBuilder.group({
    selectedToken: ''
  });
  selectedOptions: string[] = [];


  ngOnInit(): void {
    //Calling getTokens() at an appropriate time after constructing a AdminDashboardComponent instance.
    this.getTokens();
  }

  onFormSubmit() {
    console.log("onFormSubmit");
    this.selectedApiToken = this.tokenListForm.get('selectedToken')?.value[0]._id;
    console.log(this.tokenListForm.get('selectedToken')?.value);
    console.log(this.selectedApiToken);
    if (this.tokenListForm.get('selectedToken')?.value[0].status == true) {
      this.hideRevokeButton = false;
      this.hideEnableButton = true;
    } else {
      this.hideRevokeButton = true;
      this.hideEnableButton = false;
    }
    this.hideDeleteButton = false;
  }

  onListSelectionChange(ob: MatSelectionListChange) {
    console.log("onListSelectionChange");

    console.log("Selected Item: " + ob.source.selectedOptions.selected[0].value);
  }

  //Method to retrieve tokens from the service
  getTokens(): void {
    this.tokenService.getTokens()
      .subscribe(apiTokens => this.apiTokens = apiTokens);
  }

  onRevokeToken(): void {
    console.log("onRevokeToken");
    this.tokenService.updateToken(this.selectedApiToken, false).
      subscribe(apiToken => { this.resetButtonStates(false); this.ngOnInit() }
      );
  }

  onEnableToken(): void {
    console.log("onEnableToken");
    this.tokenService.updateToken(this.selectedApiToken, true).
      subscribe(apiToken => { this.resetButtonStates(false); this.ngOnInit() })
  }

  onDeleteToken(): void {
    console.log("onDeleteToken");
    this.tokenService.deleteToken(this.selectedApiToken).
      subscribe(apiToken => { this.resetButtonStates(false); this.ngOnInit() })
  }

  reloadPage(): void {
    window.location.reload();
  }

  resetButtonStates(isListItemSelected: boolean) {
    if (!isListItemSelected) {
      this.hideRevokeButton = true;
      this.hideEnableButton = true;
      this.hideDeleteButton = true;
    }
  }
}