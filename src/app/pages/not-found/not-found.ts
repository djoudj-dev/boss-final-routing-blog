import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section class="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center" aria-label="Page non trouvee">
      <h1 class="mb-2 text-8xl font-bold text-teal-500">404</h1>
      <p class="mb-6 text-xl text-slate-400">Page introuvable</p>
      <a
        routerLink="/"
        class="rounded-lg bg-teal-600 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-teal-500"
      >
        Retour a l'accueil
      </a>
    </section>
  `,
})
export class NotFoundComponent {}
