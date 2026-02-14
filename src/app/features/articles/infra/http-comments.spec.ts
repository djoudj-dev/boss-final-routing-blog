import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { HttpCommentsGateway } from './http-comments';
import { Comment } from '../domain/models/comment';

describe('HttpCommentsGateway', () => {
  let gateway: HttpCommentsGateway;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpCommentsGateway, provideHttpClient(), provideHttpClientTesting()],
    });

    gateway = TestBed.inject(HttpCommentsGateway);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  describe('getCommentsByArticle', () => {
    it.each([
      { idArticle: '1' },
      { idArticle: '42' },
    ])('should GET comments for article $idArticle', async ({ idArticle }) => {
      const expectedComments: Comment[] = [
        { id: 'c1', idArticle, author: 'jane', content: 'Nice article!' },
        { id: 'c2', idArticle, author: 'admin', content: 'Thanks!' },
      ];

      const promise = firstValueFrom(gateway.getCommentsByArticle(idArticle));

      const req = httpController.expectOne(`http://localhost:3000/comments?idArticle=${idArticle}`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedComments);

      const comments = await promise;
      expect(comments).toEqual(expectedComments);
    });
  });

  describe('getCommentsByAuthor', () => {
    it('should GET comments filtered by author', async () => {
      const author = 'jane';
      const expectedComments: Comment[] = [
        { id: 'c1', idArticle: '1', author, content: 'Nice article!' },
      ];

      const promise = firstValueFrom(gateway.getCommentsByAuthor(author));

      const req = httpController.expectOne(`http://localhost:3000/comments?author=${author}`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedComments);

      const comments = await promise;
      expect(comments).toEqual(expectedComments);
    });
  });

  describe('createComment', () => {
    it('should POST a new comment to /comments', async () => {
      const newComment: Omit<Comment, 'id'> = { idArticle: '1', author: 'jane', content: 'Great post!' };
      const createdComment: Comment = { id: 'c3', ...newComment };

      const promise = firstValueFrom(gateway.createComment(newComment));

      const req = httpController.expectOne('http://localhost:3000/comments');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newComment);
      req.flush(createdComment);

      const comment = await promise;
      expect(comment).toEqual(createdComment);
    });
  });
});
