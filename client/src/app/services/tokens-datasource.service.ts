import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/collections/data-source';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ApiToken } from '../api-token';
import { ApiTokenService } from './api-token.service';

@Injectable({
  providedIn: 'root'
})
export class TokensDatasourceService implements DataSource<ApiToken>{

  private tokenList = new BehaviorSubject<ApiToken[]>([]);
  private loadingTokens = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingTokens.asObservable();

  constructor(private apiTokenService: ApiTokenService) { }

  loadTokens(
    filter:string,
    sortDirection:string,
    pageIndex:number,
    pageSize:number) {

  this.loadingTokens.next(true);
  this.apiTokenService.getTokens().pipe(
      catchError(() => of([])),
      finalize(() => this.loadingTokens.next(false))
  )
  }
    

  connect(collectionViewer: CollectionViewer): Observable<readonly ApiToken[]> {
    return this.tokenList.asObservable();
  }
  disconnect(collectionViewer: CollectionViewer): void {
    this.tokenList.complete();
    this.loadingTokens.complete();
  }

}