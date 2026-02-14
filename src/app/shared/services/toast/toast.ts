import { Injectable, signal } from '@angular/core';

export type Toast = {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
};

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();
  private nextId = 0;

  show(message: string, type: Toast['type'] = 'info'): void {
    const id = this.nextId++;
    this._toasts.update((toasts) => [...toasts, { id, message, type }]);

    setTimeout(() => this.dismiss(id), 3000);
  }

  dismiss(id: number): void {
    this._toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }
}
