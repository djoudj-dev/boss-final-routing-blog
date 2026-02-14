import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ArticlesGateway } from '../../domain/gateways/articles';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <section aria-label="Liste des articles" class="mx-auto max-w-5xl px-4 py-10">
      <header class="mb-10">
        <h1 class="mb-2 text-4xl font-bold text-white">Le Blog</h1>
        <p class="text-slate-400">Decouvrez nos derniers articles</p>
      </header>

      <div class="grid gap-8 md:grid-cols-2">
        @for (article of articles(); track article.id) {
          <article
            class="group overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50
                   shadow-lg backdrop-blur-sm transition-all duration-300
                   hover:border-teal-500/50 hover:shadow-teal-500/10 hover:-translate-y-1"
          >
            <a [routerLink]="['/articles', article.id]">
              <figure class="aspect-video overflow-hidden">
                <img
                  [src]="article.image"
                  [alt]="article.title"
                  loading="lazy"
                  class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </figure>
              <div class="p-6">
                <div class="mb-3 flex items-center gap-3">
                  <span class="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-400">
                    {{ article.author }}
                  </span>
                  <time [attr.datetime]="article.createdAt" class="text-xs text-slate-500">{{ article.createdAt }}</time>
                </div>
                <h2 class="mb-2 text-xl font-semibold text-white group-hover:text-teal-400 transition-colors">
                  {{ article.title }}
                </h2>
                <p class="line-clamp-2 text-sm text-slate-400">
                  {{ article.content }}
                </p>
              </div>
            </a>
          </article>
        } @empty {
          <p class="col-span-2 py-20 text-center text-slate-500">Aucun article pour le moment.</p>
        }
      </div>
    </section>
  `,
})
export class HomeComponent {
  private readonly articlesGateway = inject(ArticlesGateway);
  protected readonly articles = toSignal(this.articlesGateway.getArticles(), {
    initialValue: [],
  });
}
