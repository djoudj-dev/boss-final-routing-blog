import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../domain/models/article';
import { ArticlesGateway } from '../domain/gateways/articles';

@Injectable()
export class HttpArticlesGateway extends ArticlesGateway {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/articles';

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.baseUrl);
  }

  getArticleById(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.baseUrl}/${id}`);
  }

  getArticlesByAuthor(author: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.baseUrl}?author=${author}`);
  }

  createArticle(article: Omit<Article, 'id'>): Observable<Article> {
    return this.http.post<Article>(this.baseUrl, article);
  }
}
