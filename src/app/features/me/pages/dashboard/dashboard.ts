import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map, forkJoin, of } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth';
import { ArticlesGateway } from '../../../articles/domain/gateways/articles';
import { CommentsGateway } from '../../../articles/domain/gateways/comments';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="mx-auto max-w-3xl px-4 py-10">
      <header class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-white">Mon espace</h1>
          <p class="mt-1 text-slate-400">
            Bienvenue, <span class="text-teal-400">{{ authService.currentUser()?.name }}</span>
          </p>
        </div>
        <button
          (click)="authService.logout()"
          class="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300
                 transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
        >
          Deconnexion
        </button>
      </header>

      <section aria-label="Commentaires recus">
        <h2 class="mb-6 text-xl font-semibold text-white">Commentaires recus sur mes articles</h2>

        <ul class="space-y-4" role="list">
          @for (comment of receivedComments(); track comment.id) {
            <li class="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
              <div class="mb-2 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/20 text-sm font-bold text-teal-400" aria-hidden="true">
                    {{ comment.author.charAt(0).toUpperCase() }}
                  </div>
                  <strong class="text-sm font-medium text-slate-300">{{ comment.author }}</strong>
                </div>
                <span class="text-xs text-slate-500">Article #{{ comment.idArticle }}</span>
              </div>
              <p class="text-sm text-slate-400">{{ comment.content }}</p>
            </li>
          } @empty {
            <li class="list-none rounded-xl border border-slate-700/30 bg-slate-800/20 py-12 text-center">
              <p class="text-slate-500">Aucun commentaire recu pour le moment.</p>
            </li>
          }
        </ul>
      </section>
    </div>
  `,
})
export class DashboardComponent {
  protected readonly authService = inject(AuthService);
  private readonly articlesGateway = inject(ArticlesGateway);
  private readonly commentsGateway = inject(CommentsGateway);

  private readonly login = this.authService.currentUser()!.login;

  protected readonly receivedComments = toSignal(
    this.articlesGateway.getArticlesByAuthor(this.login).pipe(
      switchMap((articles) => {
        if (articles.length === 0) return of([]);
        return forkJoin(
          articles.map((a) => this.commentsGateway.getCommentsByArticle(a.id))
        ).pipe(
          map((commentArrays) =>
            commentArrays.flat().filter((c) => c.author !== this.login)
          )
        );
      })
    ),
    { initialValue: [] }
  );
}
