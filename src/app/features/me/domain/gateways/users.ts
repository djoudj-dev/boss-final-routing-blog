import { Observable } from 'rxjs';
import { User } from '../models/user';

export abstract class UsersGateway {
  abstract login(login: string, password: string): Observable<User[]>;
  abstract register(user: Omit<User, 'id'>): Observable<User>;
}
