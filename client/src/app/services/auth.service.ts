import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MessageService } from './message.service';
import * as moment from "moment";

const AUTH_API = '/api/user/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private messageService: MessageService) { }

  login(userEmail:string, userPassword:string): Observable<any> {
    console.log("AuthService: login() - sending http req. email:"+userEmail+"password"+userPassword);
    return this.http.post<any>(AUTH_API + 'login', {email: userEmail, password: userPassword}, httpOptions).pipe(
      map(data => {
        if (data && data.idToken) {
          //localStorage.setItem('id_token', JSON.stringify(data.idToken));
          this.setSession(data.idToken, data.expiresIn)
        }
      }),
      catchError(this.handleError<any>('login'))
    );
  }

  private setSession(idToken: any, expiresIn: any) {
    const expiresAt = moment().add(expiresIn,'second');
    console.log("Login Success");
    localStorage.setItem('id_token', idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
    console.log("setSession: id_token:"+ idToken + " expiresIn:"+ JSON.stringify(expiresIn));
  }    
 
  logout() {
      localStorage.removeItem("id_token");
      localStorage.removeItem("expires_at");
  }

  public isLoggedIn() {
      return moment().isBefore(this.getExpiration());
  }

  public isLoggedOut() {
      return !this.isLoggedIn();
  }

  getExpiration() {
      const expiration = localStorage.getItem("expires_at");
      if(expiration) {
      return moment( JSON.parse(expiration));
      }
      return null;
  }
  
  register(userName: string, userEmail: string, userPassword: string): Observable<any> {
    return this.http.post(AUTH_API + 'register', {
      name: userName,
      email: userEmail,
      password: userPassword
    }, httpOptions).pipe(
      tap(_ => this.log(`login id=${userEmail}`)),
      catchError(this.handleError<any>('register')));;
  }

  /** Log message with the MessageService */
  private log(message: string) {
    this.messageService.add(`AuthService: ${message}`);
    console.log(`\nAuthService: ${message}`);
}

   /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    console.log("handleError()");
    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}

}