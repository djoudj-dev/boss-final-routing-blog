import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withPreloading, withViewTransitions } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { CustomPreloadingStrategy } from './core/strategies/custom-preloading';
import { ArticlesGateway } from './features/articles/domain/gateways/articles';
import { HttpArticlesGateway } from './features/articles/infra/http-articles';
import { CommentsGateway } from './features/articles/domain/gateways/comments';
import { HttpCommentsGateway } from './features/articles/infra/http-comments';
import { UsersGateway } from './features/me/domain/gateways/users';
import { HttpUsersGateway } from './features/me/infra/http-users';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding(), withPreloading(CustomPreloadingStrategy), withViewTransitions()),
    provideHttpClient(),
    { provide: ArticlesGateway, useClass: HttpArticlesGateway },
    { provide: CommentsGateway, useClass: HttpCommentsGateway },
    { provide: UsersGateway, useClass: HttpUsersGateway },
  ],
};
