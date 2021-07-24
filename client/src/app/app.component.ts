import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'api-token-management-app';

  adminLoggedIn = false;
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.adminLoggedIn = this.authService.isLoggedIn();
  }
  
  onAdminLogout() {
    if (this.adminLoggedIn) {
      this.authService.logout()
      this.ngOnInit();
      this.router.navigate(['./home']);
    }
  }
  
  isAdminLoggedIn(): boolean {
    return this.authService.isLoggedIn()
  }
}

