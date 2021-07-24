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
    this.log("saveAdminAuthToken TOKEN_KEY:"+token);
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getAdminAuthToken(): string | null{
    this.log("getAdminAuthToken");
    return sessionStorage.getItem(TOKEN_KEY);
  }
/*
  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    let user = sessionStorage.getItem(USER_KEY);
    if(user){
    return JSON.parse( user );
  }
 
  }
 */
  /** Log message with the MessageService */
  private log(message: string) {
    this.messageService.add(`AdminAuthDataService: ${message}`);
}
}
