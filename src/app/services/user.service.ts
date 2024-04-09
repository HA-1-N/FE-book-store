import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../common/Login';
import { User } from '../common/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = 'https://book-store-production-e810.up.railway.app/api/users';
  urlAuthentication = 'https://book-store-production-e810.up.railway.app/api';
  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get(this.url);
  }

  get(id: number) {
    return this.httpClient.get(this.url + '/' + id);
  }

  post(user: User) {
    return this.httpClient.post(this.url, user);
  }

  put(id: number, user: User) {
    return this.httpClient.put(this.url + '/' + id, user);
  }

  delete(id: number) {
    return this.httpClient.delete(this.url + '/' + id);
  }

  login(login: Login) {
    return this.httpClient.post(this.urlAuthentication + '/admin/login', login);
  }
}
