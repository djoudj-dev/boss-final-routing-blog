import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { HttpArticlesGateway } from './http-articles';
import { Article } from '../domain/models/article';

describe('HttpArticlesGateway', () => {
  let gateway: HttpArticlesGateway;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpArticlesGateway, provideHttpClient(), provideHttpClientTesting()],
    });

    gateway = TestBed.inject(HttpArticlesGateway);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  describe('getArticles', () => {
    it('should GET all articles from /articles', async () => {
      const expectedArticles: Article[] = [
        { id: '1', title: 'Article 1', author: 'admin', content: 'Content 1', image: 'img1.jpg', createdAt: '2024-01-01' },
        { id: '2', title: 'Article 2', author: 'jane', content: 'Content 2', image: 'img2.jpg', createdAt: '2024-01-02' },
      ];

      const promise = firstValueFrom(gateway.getArticles());

      const req = httpController.expectOne('http://localhost:3000/articles');
      expect(req.request.method).toBe('GET');
      req.flush(expectedArticles);

      const articles = await promise;
      expect(articles).toEqual(expectedArticles);
    });
  });

  describe('getArticleById', () => {
    it.each([
      { id: '1', title: 'Article 1' },
      { id: '42', title: 'Article 42' },
    ])('should GET article with id $id from /articles/$id', async ({ id, title }) => {
      const expectedArticle: Article = { id, title, author: 'admin', content: 'Content', image: 'img.jpg', createdAt: '2024-01-01' };

      const promise = firstValueFrom(gateway.getArticleById(id));

      const req = httpController.expectOne(`http://localhost:3000/articles/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedArticle);

      const article = await promise;
      expect(article).toEqual(expectedArticle);
    });
  });

  describe('getArticlesByAuthor', () => {
    it('should GET articles filtered by author from /articles?author=', async () => {
      const author = 'admin';
      const expectedArticles: Article[] = [
        { id: '1', title: 'Article 1', author, content: 'Content 1', image: 'img1.jpg', createdAt: '2024-01-01' },
      ];

      const promise = firstValueFrom(gateway.getArticlesByAuthor(author));

      const req = httpController.expectOne(`http://localhost:3000/articles?author=${author}`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedArticles);

      const articles = await promise;
      expect(articles).toEqual(expectedArticles);
    });
  });

  describe('createArticle', () => {
    it('should POST a new article to /articles', async () => {
      const newArticle: Omit<Article, 'id'> = { title: 'New', author: 'admin', content: 'New content', image: 'new.jpg', createdAt: '2024-01-03' };
      const createdArticle: Article = { id: '3', ...newArticle };

      const promise = firstValueFrom(gateway.createArticle(newArticle));

      const req = httpController.expectOne('http://localhost:3000/articles');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newArticle);
      req.flush(createdArticle);

      const article = await promise;
      expect(article).toEqual(createdArticle);
    });
  });
});
