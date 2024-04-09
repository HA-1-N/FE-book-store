import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  url = 'https://book-store-production-e810.up.railway.app/api/categories';

  constructor(private httpClient: HttpClient) {}

  getAll() {
    return this.httpClient.get(this.url);
  }
}
