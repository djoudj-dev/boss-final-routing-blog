import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../domain/models/user';
import { UsersGateway } from '../domain/gateways/users';

@Injectable()
export class HttpUsersGateway extends UsersGateway {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/users';

  login(login: string, password: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}?login=${login}&password=${password}`);
  }

  register(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.baseUrl, user);
  }
}
