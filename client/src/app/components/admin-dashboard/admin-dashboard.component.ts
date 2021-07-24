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
  
    this.selectedApiToken = this.tokenListForm.get('selectedToken')?.value[0]._id;
    
    if (this.tokenListForm.get('selectedToken')?.value[0].status == true) {
      this.hideRevokeButton = false;
      this.hideEnableButton = true;
    } else {
      this.hideRevokeButton = true;
      this.hideEnableButton = false;
    }
    this.hideDeleteButton = false;
  }

  /** Method to retrieve tokens from the TokenService
  */
  getTokens(): void {
    this.tokenService.getTokens()
      .subscribe(apiTokens => this.apiTokens = apiTokens);
  }

  /** Method to revoke token by calling TokenService method
  */
  onRevokeToken(): void {
    this.tokenService.updateToken(this.selectedApiToken, false).
      subscribe(apiToken => { this.resetButtonStates(false); this.ngOnInit() }
      );
  }

  /** Method to enable token by calling TokenService method
  */
  onEnableToken(): void {
    this.tokenService.updateToken(this.selectedApiToken, true).
      subscribe(apiToken => { this.resetButtonStates(false); this.ngOnInit() })
  }

  /** Method to delete token by calling TokenService method
  */
  onDeleteToken(): void {
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