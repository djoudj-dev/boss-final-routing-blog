import { Observable } from 'rxjs';
import { Comment } from '../models/comment';

export abstract class CommentsGateway {
  abstract getCommentsByArticle(idArticle: string): Observable<Comment[]>;
  abstract getCommentsByAuthor(author: string): Observable<Comment[]>;
  abstract createComment(comment: Omit<Comment, 'id'>): Observable<Comment>;
}
