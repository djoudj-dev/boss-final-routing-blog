import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { HttpUsersGateway } from './http-users';
import { User } from '../domain/models/user';

describe('HttpUsersGateway', () => {
  let gateway: HttpUsersGateway;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpUsersGateway, provideHttpClient(), provideHttpClientTesting()],
    });

    gateway = TestBed.inject(HttpUsersGateway);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  describe('login', () => {
    it('should GET users matching login and password', async () => {
      const login = 'admin';
      const password = 'admin';
      const expectedUsers: User[] = [
        { id: '1', login: 'admin', password: 'admin', name: 'Admin' },
      ];

      const promise = firstValueFrom(gateway.login(login, password));

      const req = httpController.expectOne(`http://localhost:3000/users?login=${login}&password=${password}`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedUsers);

      const users = await promise;
      expect(users).toEqual(expectedUsers);
    });

    it('should return empty array when credentials are invalid', async () => {
      const login = 'unknown';
      const password = 'wrong';

      const promise = firstValueFrom(gateway.login(login, password));

      const req = httpController.expectOne(`http://localhost:3000/users?login=${login}&password=${password}`);
      expect(req.request.method).toBe('GET');
      req.flush([]);

      const users = await promise;
      expect(users).toEqual([]);
    });
  });

  describe('register', () => {
    it('should POST a new user to /users', async () => {
      const newUser: Omit<User, 'id'> = { login: 'newuser', password: 'pass123', name: 'New User' };
      const createdUser: User = { id: '2', ...newUser };

      const promise = firstValueFrom(gateway.register(newUser));

      const req = httpController.expectOne('http://localhost:3000/users');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUser);
      req.flush(createdUser);

      const user = await promise;
      expect(user).toEqual(createdUser);
    });
  });
});
