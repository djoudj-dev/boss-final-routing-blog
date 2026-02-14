import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../domain/models/comment';
import { CommentsGateway } from '../domain/gateways/comments';

@Injectable()
export class HttpCommentsGateway extends CommentsGateway {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/comments';

  getCommentsByArticle(idArticle: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}?idArticle=${idArticle}`);
  }

  getCommentsByAuthor(author: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}?author=${author}`);
  }

  createComment(comment: Omit<Comment, 'id'>): Observable<Comment> {
    return this.http.post<Comment>(this.baseUrl, comment);
  }
}
