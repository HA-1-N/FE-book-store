import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rate } from '../common/Rate';

@Injectable({
  providedIn: 'root',
})
export class RateService {
  url = 'https://book-store-production-e810.up.railway.app/api/rates';

  constructor(private httpClient: HttpClient) {}

  getAll() {
    return this.httpClient.get(this.url);
  }

  getById(id: number) {
    return this.httpClient.get(this.url + '/' + id);
  }

  getAvgStarProduct(id: number) {
    return this.httpClient.get(this.url + '/product-avg/' + id);
  }

  getByProduct(id: number) {
    return this.httpClient.get(this.url + '/product/' + id);
  }

  post(rate: Rate) {
    return this.httpClient.post(this.url, rate);
  }
}
