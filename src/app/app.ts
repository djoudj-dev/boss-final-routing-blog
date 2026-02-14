import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast';
import { AuthService } from './core/auth/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastComponent],
  template: `
    <nav class="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <a routerLink="/" class="text-xl font-bold text-white hover:text-teal-400 transition-colors">
          <span class="text-teal-400">&lt;</span>Blog<span class="text-teal-400">/&gt;</span>
        </a>

        <div class="flex items-center gap-1">
          @if (!isOnHome()) {
            <a
              routerLink="/"
              class="rounded-lg px-3 py-2 text-sm text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
            >
              Accueil
            </a>
          }

          <a
            routerLink="/"
            routerLinkActive="!bg-teal-500/10 !text-teal-400"
            [routerLinkActiveOptions]="{ exact: true }"
            class="rounded-lg px-3 py-2 text-sm text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
          >
            Articles
          </a>

          <a
            routerLink="/me"
            routerLinkActive="!bg-teal-500/10 !text-teal-400"
            class="rounded-lg px-3 py-2 text-sm text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
          >
            @if (authService.isLoggedIn()) {
              Mon espace
            } @else {
              Connexion
            }
          </a>

          @if (authService.isLoggedIn()) {
            <button
              (click)="authService.logout()"
              class="ml-2 rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-400
                     transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
            >
              Deconnexion
            </button>
          }
        </div>
      </div>
    </nav>

    <main class="relative min-h-[calc(100vh-57px)]">
      <router-outlet />
    </main>

    <footer class="border-t border-slate-700/50 bg-slate-900/50 py-6 text-center">
      <p class="text-sm text-slate-500">Mini Blog CMS &mdash; Easy Angular Kit (EAK)</p>
    </footer>

    <app-toast />
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
    }
  `,
})
export class App {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected isOnHome(): boolean {
    return this.router.url === '/';
  }
}
