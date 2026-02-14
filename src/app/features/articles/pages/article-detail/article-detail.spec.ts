import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { defer, of } from 'rxjs';
import { ArticleDetailComponent } from './article-detail';
import { ArticlesGateway } from '../../domain/gateways/articles';
import { CommentsGateway } from '../../domain/gateways/comments';
import { ToastService } from '../../../../shared/services/toast/toast';
import { AuthService } from '../../../../core/auth/auth';
import { Article } from '../../domain/models/article';

describe('ArticleDetailComponent', () => {
  const article: Article = {
    id: '1',
    title: 'Mon super article',
    author: 'admin',
    content: 'Le contenu de mon article',
    image: 'img.jpg',
    createdAt: '2024-01-01',
  };

  let articlesGatewayStub: {
    getArticleById: ReturnType<typeof vi.fn>;
  };
  let commentsGatewayStub: {
    getCommentsByArticle: ReturnType<typeof vi.fn>;
    createComment: ReturnType<typeof vi.fn>;
  };
  let toastServiceStub: { show: ReturnType<typeof vi.fn> };
  let authServiceStub: {
    currentUser: ReturnType<typeof vi.fn>;
    isLoggedIn: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    articlesGatewayStub = {
      getArticleById: vi.fn().mockReturnValue(defer(() => of(article))),
    };
    commentsGatewayStub = {
      getCommentsByArticle: vi.fn().mockReturnValue(defer(() => of([]))),
      createComment: vi.fn(),
    };
    toastServiceStub = { show: vi.fn() };
    authServiceStub = {
      currentUser: vi.fn().mockReturnValue(null),
      isLoggedIn: vi.fn().mockReturnValue(false),
    };

    TestBed.overrideComponent(ArticleDetailComponent, {
      set: {
        imports: [],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          { provide: ArticlesGateway, useValue: articlesGatewayStub },
          { provide: CommentsGateway, useValue: commentsGatewayStub },
          { provide: ToastService, useValue: toastServiceStub },
          { provide: AuthService, useValue: authServiceStub },
        ],
      },
    });
  });

  it('should display the article title', async () => {
    const fixture = TestBed.createComponent(ArticleDetailComponent);
    fixture.componentRef.setInput('id', '1');

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Mon super article');
  });

  it('should display the article content', async () => {
    const fixture = TestBed.createComponent(ArticleDetailComponent);
    fixture.componentRef.setInput('id', '1');

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Le contenu de mon article');
  });

  it('should display the article author', async () => {
    const fixture = TestBed.createComponent(ArticleDetailComponent);
    fixture.componentRef.setInput('id', '1');

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('admin');
  });
});
