import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: any = {
    email: null,
    password: null
  };

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  onLogIn() {
    const { email, password } = this.form;
    this.authService.login(email, password).subscribe(
      (data) => {
        this.reloadPage()
      },
      error => {
        this.errorMessage = error;
        this.isLoginFailed = true;
      });
  }

  reloadPage(): void {
    if (this.authService.isLoggedIn()) {
      this.isLoginFailed = false;
      this.isLoggedIn = true;
      window.location.reload();
      this.router.navigate(['./admin-dashboard']);
    } else {
      this.isLoginFailed = true;
      this.isLoginFailed = true;
    }
  }

}
