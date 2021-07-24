import { Injectable } from '@angular/core';
import { MessageService } from './message.service';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthDataService {

  constructor(private messageService: MessageService) { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveAdminAuthToken(token: string): void {
    this.log("saveAdminAuthToken TOKEN_KEY:" + token);
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  /** Get session authorization token 
  */
  public getAdminAuthToken(): string | null {
    this.log("getAdminAuthToken");
    return sessionStorage.getItem(TOKEN_KEY);
  }
  
  /** Log message with the MessageService 
  */
  private log(message: string) {
    this.messageService.add(`AdminAuthDataService: ${message}`);
  }
}
