import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { ApiToken, TokenStatus } from '../api-token';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const tokens = [
      { id: 1, value: '12345678', status: TokenStatus.Active, expiry: new Date(2021, 7, 21, 17, 23, 42, 11) },
      { id: 2, value: '23456789', status: TokenStatus.Active, expiry: new Date(2021, 7, 21, 18, 23, 42, 11) },
      { id: 3, value: '34567890', status: TokenStatus.Active, expiry: new Date(2021, 7, 21, 19, 23, 42, 11) },
      { id: 4, value: "45678901", status: TokenStatus.Inactive, expiry: new Date(2021, 7, 22, 20, 23, 42, 11) },
      { id: 5, value: "56789012", status: TokenStatus.Active, expiry: new Date(2021, 7, 22, 21, 23, 42, 11) },
      { id: 6, value: "67890123", status: TokenStatus.Active, expiry: new Date(2021, 7, 22, 22, 23, 42, 11) },
      { id: 7, value: "78901234", status: TokenStatus.Active, expiry: new Date(2021, 7, 23, 23, 23, 42, 11) },
      { id: 8, value: "89012345", status: TokenStatus.Inactive, expiry: new Date(2021, 7, 24, 0, 23, 42, 11) },
      { id: 9, value: "90123456", status: TokenStatus.Active, expiry: new Date(2021, 7, 25, 1, 23, 42, 11) },
      { id: 10, value: "01234567", status: TokenStatus.Active, expiry: new Date(2021, 7, 26, 2, 23, 42, 11) }
    ];
    return { tokens };
  }

}