import { Routes } from '@angular/router';
import { HomeComponent } from './features/articles/pages/home/home';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    data: { animation: 'home' },
  },
  {
    path: 'articles/:id',
    loadComponent: () =>
      import('./features/articles/pages/article-detail/article-detail').then(
        (m) => m.ArticleDetailComponent
      ),
    data: { animation: 'article-detail', preload: true },
  },
  {
    path: 'me',
    loadChildren: () => import('./features/me/me.routes').then((m) => m.ME_ROUTES),
    data: { animation: 'me', preload: true, preloadDelay: 3000 },
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found').then((m) => m.NotFoundComponent),
    data: { animation: 'not-found' },
  },
];
