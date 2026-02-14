import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { defer, of } from 'rxjs';
import { HomeComponent } from './home';
import { ArticlesGateway } from '../../domain/gateways/articles';
import { Article } from '../../domain/models/article';

describe('HomeComponent', () => {
  it('should display the list of articles in the DOM', async () => {
    const articles: Article[] = [
      { id: '1', title: 'Premier article', author: 'admin', content: 'Contenu 1', image: 'img1.jpg', createdAt: '2024-01-01' },
      { id: '2', title: 'Deuxieme article', author: 'jane', content: 'Contenu 2', image: 'img2.jpg', createdAt: '2024-01-02' },
    ];

    const articlesGatewayStub = {
      getArticles: () => defer(() => of(articles)),
    };

    TestBed.overrideComponent(HomeComponent, {
      set: {
        imports: [],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [{ provide: ArticlesGateway, useValue: articlesGatewayStub }],
      },
    });

    const fixture = TestBed.createComponent(HomeComponent);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Premier article');
    expect(compiled.textContent).toContain('Deuxieme article');
    expect(compiled.textContent).toContain('admin');
    expect(compiled.textContent).toContain('jane');
  });

  it('should display empty message when there are no articles', async () => {
    const articlesGatewayStub = {
      getArticles: () => defer(() => of([])),
    };

    TestBed.overrideComponent(HomeComponent, {
      set: {
        imports: [],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [{ provide: ArticlesGateway, useValue: articlesGatewayStub }],
      },
    });

    const fixture = TestBed.createComponent(HomeComponent);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Aucun article pour le moment.');
  });
});
