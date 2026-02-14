import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth';
import { ToastService } from '../../../../shared/services/toast/toast';

type LoginForm = {
  login: FormControl<string>;
  password: FormControl<string>;
};

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="flex min-h-[60vh] items-center justify-center px-4">
      <div class="w-full max-w-md rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 shadow-xl backdrop-blur-sm">
        <div class="mb-8 text-center">
          <h1 class="text-2xl font-bold text-white">Connexion</h1>
          <p class="mt-2 text-sm text-slate-400">Accedez a votre espace personnel</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <fieldset class="space-y-5">
            <legend class="sr-only">Informations de connexion</legend>
            <div>
              <label for="login" class="mb-1 block text-sm font-medium text-slate-300">Identifiant</label>
              <input
                id="login"
                formControlName="login"
                class="w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2.5 text-sm text-white
                       placeholder-slate-500 transition-colors focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                placeholder="Votre identifiant"
              />
              @if (loginForm.controls.login.touched && loginForm.controls.login.errors?.['required']) {
                <small class="mt-1 block text-xs text-red-400">L'identifiant est obligatoire.</small>
              }
            </div>
            <div>
              <label for="password" class="mb-1 block text-sm font-medium text-slate-300">Mot de passe</label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2.5 text-sm text-white
                       placeholder-slate-500 transition-colors focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                placeholder="Votre mot de passe"
              />
              @if (loginForm.controls.password.touched && loginForm.controls.password.errors?.['required']) {
                <small class="mt-1 block text-xs text-red-400">Le mot de passe est obligatoire.</small>
              }
            </div>
          </fieldset>
          <button
            type="submit"
            [disabled]="loginForm.invalid"
            class="w-full rounded-lg bg-teal-600 py-2.5 text-sm font-medium text-white transition-all
                   hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Se connecter
          </button>
        </form>

        <aside class="mt-6 space-y-3 text-center" aria-label="Aide a la connexion">
          <p class="text-sm text-slate-500">
            Pas encore de compte ?
            <a routerLink="/me/register" class="text-teal-400 hover:text-teal-300 transition-colors">Creer un compte</a>
          </p>
          <div class="rounded-lg border border-slate-700/50 bg-slate-900/30 px-4 py-3">
            <p class="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Comptes de demo</p>
            <ul class="flex justify-center gap-4" role="list">
              <li class="rounded-md bg-slate-800 px-2.5 py-1 font-mono text-xs text-teal-400">admin / admin</li>
              <li class="rounded-md bg-slate-800 px-2.5 py-1 font-mono text-xs text-teal-400">jane / jane</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  protected readonly loginForm = new FormGroup<LoginForm>({
    login: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { login, password } = this.loginForm.getRawValue();
    this.authService.login(login, password).subscribe((users) => {
      if (users.length > 0) {
        this.authService.setUser(users[0]);
        this.toastService.show(`Bienvenue ${users[0].name} !`, 'success');
        this.router.navigate(['/me']);
      } else {
        this.toastService.show('Identifiant ou mot de passe incorrect', 'error');
      }
    });
  }
}
