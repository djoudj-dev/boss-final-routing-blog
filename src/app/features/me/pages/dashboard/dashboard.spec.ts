import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { defer, of } from 'rxjs';
import { DashboardComponent } from './dashboard';
import { AuthService } from '../../../../core/auth/auth';
import { ArticlesGateway } from '../../../articles/domain/gateways/articles';
import { CommentsGateway } from '../../../articles/domain/gateways/comments';
import { User } from '../../domain/models/user';

describe('DashboardComponent', () => {
  const currentUser: User = { id: '1', login: 'admin', password: 'admin', name: 'Admin' };

  let authServiceStub: {
    currentUser: ReturnType<typeof vi.fn>;
    isLoggedIn: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    authServiceStub = {
      currentUser: vi.fn().mockReturnValue(currentUser),
      isLoggedIn: vi.fn().mockReturnValue(true),
      logout: vi.fn(),
    };

    TestBed.overrideComponent(DashboardComponent, {
      set: {
        imports: [],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          { provide: AuthService, useValue: authServiceStub },
          { provide: ArticlesGateway, useValue: { getArticlesByAuthor: () => defer(() => of([])) } },
          { provide: CommentsGateway, useValue: { getCommentsByArticle: () => defer(() => of([])) } },
        ],
      },
    });
  });

  it('should display the user name', async () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Admin');
  });

  it('should display empty message when no comments received', async () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Aucun commentaire recu pour le moment.');
  });
});
