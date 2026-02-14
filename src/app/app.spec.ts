import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { App } from './app';
import { AuthService } from './core/auth/auth';
import { Router } from '@angular/router';

describe('App', () => {
  it('should create the app', () => {
    TestBed.overrideComponent(App, {
      set: {
        imports: [],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          { provide: AuthService, useValue: { isLoggedIn: () => false, currentUser: () => null } },
          { provide: Router, useValue: { url: '/', navigate: vi.fn() } },
        ],
      },
    });

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });
});
