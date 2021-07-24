import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiTokenService } from 'src/app/services/api-token.service';

@Component({
  selector: 'app-create-token',
  templateUrl: './create-token.component.html',
  styleUrls: ['./create-token.component.css']
})

export class CreateTokenComponent implements OnInit {

  newTokenForm = new FormGroup({
    tokenName: new FormControl(''),
    tokenDescription: new FormControl(''),
  });

  isTokenCreated = false;
  errorMessage = '';

  constructor(private tokenService: ApiTokenService) { }

  ngOnInit(): void {
  }

  //Method to create new token by calling TokenService method
  onCreateNewToken(): void {
    const { tokenName, tokenDescription } = this.newTokenForm.value;
    
    this.tokenService.createToken(tokenName, tokenDescription)
      .subscribe(_apiToken => { this.isTokenCreated = true 
      },
        error => {
          this.errorMessage = error
      }
    );
  }

}
