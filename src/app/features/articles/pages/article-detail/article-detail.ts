import { Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { ArticlesGateway } from '../../domain/gateways/articles';
import { CommentsGateway } from '../../domain/gateways/comments';
import { ScrollToTopComponent } from '../../../../shared/components/scroll-to-top/scroll-to-top';
import { ToastService } from '../../../../shared/services/toast/toast';
import { AuthService } from '../../../../core/auth/auth';
import { Comment } from '../../domain/models/comment';

type CommentForm = {
  author: FormControl<string>;
  content: FormControl<string>;
};

@Component({
  selector: 'app-article-detail',
  imports: [RouterLink, ReactiveFormsModule, ScrollToTopComponent],
  template: `
    <div class="mx-auto max-w-3xl px-4 py-10">
      <nav aria-label="Fil d'ariane">
        <a routerLink="/" class="mb-6 inline-flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Retour aux articles
        </a>
      </nav>

      @if (article()) {
        <article>
          <figure>
            <img
              [src]="article()!.image"
              [alt]="article()!.title"
              class="mb-8 aspect-video w-full rounded-2xl object-cover shadow-lg"
            />
          </figure>
          <header class="mb-6">
            <div class="mb-4 flex items-center gap-3">
              <span class="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-400">
                {{ article()!.author }}
              </span>
              <time [attr.datetime]="article()!.createdAt" class="text-xs text-slate-500">{{ article()!.createdAt }}</time>
            </div>
            <h1 class="text-3xl font-bold text-white">{{ article()!.title }}</h1>
          </header>
          <div class="prose prose-invert max-w-none text-slate-300 leading-relaxed">
            <p>{{ article()!.content }}</p>
          </div>
        </article>

        <section id="comments" aria-label="Commentaires" class="mt-12 border-t border-slate-700/50 pt-10">
          <h2 class="mb-6 text-2xl font-semibold text-white">Commentaires</h2>

          <form
            [formGroup]="commentForm"
            (ngSubmit)="onSubmitComment()"
            class="mb-8 rounded-xl border border-slate-700/50 bg-slate-800/50 p-6"
          >
            <fieldset class="space-y-4">
              <legend class="sr-only">Ajouter un commentaire</legend>
              <div>
                <label for="author" class="mb-1 block text-sm font-medium text-slate-300">Auteur</label>
                <input
                  id="author"
                  formControlName="author"
                  class="w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2.5 text-sm text-white
                         placeholder-slate-500 transition-colors focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Votre nom"
                />
                @if (commentForm.controls.author.touched && commentForm.controls.author.errors?.['required']) {
                  <small class="mt-1 block text-xs text-red-400">L'auteur est obligatoire.</small>
                }
              </div>
              <div>
                <label for="content" class="mb-1 block text-sm font-medium text-slate-300">Commentaire</label>
                <textarea
                  id="content"
                  formControlName="content"
                  rows="3"
                  class="w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2.5 text-sm text-white
                         placeholder-slate-500 transition-colors focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Votre commentaire..."
                ></textarea>
                @if (commentForm.controls.content.touched && commentForm.controls.content.errors?.['required']) {
                  <small class="mt-1 block text-xs text-red-400">Le commentaire est obligatoire.</small>
                }
              </div>
            </fieldset>
            <button
              type="submit"
              [disabled]="commentForm.invalid"
              class="mt-4 rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-medium text-white transition-all
                     hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Publier
            </button>
          </form>

          <ul class="space-y-4" role="list">
            @for (comment of comments(); track comment.id) {
              <li class="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
                <div class="mb-2 flex items-center gap-2">
                  <div class="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/20 text-sm font-bold text-teal-400" aria-hidden="true">
                    {{ comment.author.charAt(0).toUpperCase() }}
                  </div>
                  <strong class="text-sm font-medium text-slate-300">{{ comment.author }}</strong>
                </div>
                <p class="text-sm text-slate-400">{{ comment.content }}</p>
              </li>
            } @empty {
              <li class="text-center text-sm text-slate-500 list-none">Aucun commentaire pour cet article.</li>
            }
          </ul>
        </section>
      } @else {
        <div class="py-20 text-center" aria-live="polite">
          <div class="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-600 border-t-teal-500" role="status" aria-label="Chargement"></div>
          <p class="text-slate-500">Chargement...</p>
        </div>
      }

      <app-scroll-to-top />
    </div>
  `,
})
export class ArticleDetailComponent implements OnInit {
  readonly id = input.required<string>();

  private readonly articlesGateway = inject(ArticlesGateway);
  private readonly commentsGateway = inject(CommentsGateway);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);

  private readonly id$ = toObservable(this.id);

  protected readonly article = toSignal(
    this.id$.pipe(switchMap((id) => (id ? this.articlesGateway.getArticleById(id) : of(undefined))))
  );
  protected readonly comments = signal<Comment[]>([]);

  protected readonly commentForm = new FormGroup<CommentForm>({
    author: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    content: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit(): void {
    this.loadComments();
    const user = this.authService.currentUser();
    if (user) {
      this.commentForm.controls.author.setValue(user.login);
    }
  }

  private loadComments(): void {
    this.commentsGateway.getCommentsByArticle(this.id()).subscribe((comments) => {
      this.comments.set(comments);
    });
  }

  protected onSubmitComment(): void {
    if (this.commentForm.invalid) return;

    const { author, content } = this.commentForm.getRawValue();
    this.commentsGateway
      .createComment({ idArticle: this.id(), author, content })
      .subscribe((comment) => {
        this.comments.update((c) => [...c, comment]);
        this.commentForm.reset();
        this.toastService.show('Commentaire publie avec succes !', 'success');
      });
  }
}
