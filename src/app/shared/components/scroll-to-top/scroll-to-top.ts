import { Component } from '@angular/core';

@Component({
  selector: 'app-scroll-to-top',
  template: `
    <button
      (click)="scrollToTop()"
      class="fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full
             bg-teal-600 text-white shadow-lg transition-all hover:bg-teal-500 hover:shadow-teal-500/25
             active:scale-95"
      aria-label="Retour en haut"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd"
          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
          clip-rule="evenodd" />
      </svg>
    </button>
  `,
})
export class ScrollToTopComponent {
  protected scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
