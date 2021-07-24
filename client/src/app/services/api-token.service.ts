import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiToken } from '../api-token';
import { API_TOKENS } from '../mock-tokens';
import { MessageService } from './message.service';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiTokenService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private tokenListUrl = 'api/token';  // URL to web api
  private createTokenUrl = 'api/token/generate';  // URL to web api

  /* Inject HttpClient in private property and inject message service */
  constructor(private http: HttpClient,
    private messageService: MessageService) { }

  /* For testing purpose only - returning mock data 
  getTokens(): ApiToken[] {
    return API_TOKENS;
  }
  getTokens(): Observable<ApiToken[]> {
    const tokens = of(API_TOKENS);
    return tokens;
  }
  */

  /** GET tokens from the server */
  getTokens(): Observable<ApiToken[]> {
    return this.http.get<ApiToken[]>(this.tokenListUrl).pipe(
      tap(_ => this.log('fetched tokens')),
      catchError(this.handleError<ApiToken[]>('getTokens', []))
    );
  }

  /** Log message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ApiTokenService: ${message}`);
  }

  /** POST: Generate new token on the server 
  */
  createToken(tokenName: string, tokenDescription: string): Observable<any> {
    return this.http.post(this.createTokenUrl, { name: tokenName, description: tokenDescription }, this.httpOptions);
  }

  /** GET: Get token by id. 
  */
  getToken(id: string): Observable<ApiToken> {
    const url = `${this.tokenListUrl}/${id}`;

    return this.http.get<ApiToken>(url).pipe(
      tap(_ => this.log(`fetched token _id=${id}`)),
      catchError(this.handleError<ApiToken>(`getToken id=${id}`))
    );
  }

  /** PATCH: Update the token on the server 
  */
  updateToken(tokenId: string, enable: boolean): Observable<any> {
    const url = `${this.tokenListUrl}/${tokenId}`;

    return this.http.patch(url, { status: enable }, this.httpOptions).pipe(
      tap(_ => this.log(`updated token id=${tokenId}`)),
      catchError(this.handleError<any>('updateToken'))
    );
  }

  /** DELETE: Delete the token from the server 
  */
  deleteToken(id: string): Observable<ApiToken> {
    const url = `${this.tokenListUrl}/${id}`;

    return this.http.delete<ApiToken>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted token id=${id}`)),
      catchError(this.handleError<ApiToken>('deleteToken'))
    );
  }

  /** VALIDATE: Check validity of the token from the server 
  */
  validateToken(id: string): Observable<ApiToken> {
    const url = `${this.tokenListUrl}/validate/${id}`;

    return this.http.get<ApiToken>(url).pipe(
      tap(data => this.log(`valid till` + data.validTo)));
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
   private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
