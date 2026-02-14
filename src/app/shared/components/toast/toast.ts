import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast/toast';

@Component({
  selector: 'app-toast',
  template: `
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="flex items-center gap-3 rounded-xl border px-5 py-3 shadow-lg backdrop-blur-sm transition-all duration-300"
          [class]="toastClasses(toast.type)"
          (click)="toastService.dismiss(toast.id)"
        >
          <span class="text-lg">
            @switch (toast.type) {
              @case ('success') { &#10003; }
              @case ('error') { &#10007; }
              @case ('info') { &#8505; }
            }
          </span>
          <span class="text-sm font-medium">{{ toast.message }}</span>
        </div>
      }
    </div>
  `,
})
export class ToastComponent {
  protected readonly toastService = inject(ToastService);

  protected toastClasses(type: string): string {
    switch (type) {
      case 'success':
        return 'bg-emerald-900/80 border-emerald-700 text-emerald-200';
      case 'error':
        return 'bg-red-900/80 border-red-700 text-red-200';
      default:
        return 'bg-slate-800/80 border-slate-600 text-slate-200';
    }
  }
}
