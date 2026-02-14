import { Observable } from 'rxjs';
import { Article } from '../models/article';

export abstract class ArticlesGateway {
  abstract getArticles(): Observable<Article[]>;
  abstract getArticleById(id: string): Observable<Article>;
  abstract getArticlesByAuthor(author: string): Observable<Article[]>;
  abstract createArticle(article: Omit<Article, 'id'>): Observable<Article>;
}
