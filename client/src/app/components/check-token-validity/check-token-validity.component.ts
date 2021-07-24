import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiTokenService } from 'src/app/services/api-token.service';

@Component({
  selector: 'app-check-token-validity',
  templateUrl: './check-token-validity.component.html',
  styleUrls: ['./check-token-validity.component.css']
})
export class CheckTokenValidityComponent implements OnInit {

  tokenId = new FormControl('');
  showResult: boolean = false;
  isFailed: boolean = false;
  errorMessage: string = '';
  validity: Date = new Date();

  constructor(private tokenService: ApiTokenService) { }

  ngOnInit(): void {
  }

  checkTokenValidity() {
    const tokenId = this.tokenId.value;
    
    this.tokenService.validateToken(tokenId)
      .subscribe(apiToken => {
        this.validity = apiToken.validTo;
        this.showResult = true;
        this.isFailed = false;
      },
        error => {
          this.errorMessage = error.statusText;
          this.isFailed = true;
          this.showResult = true;
      }
    );

  }
}
