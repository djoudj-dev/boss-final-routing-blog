import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersGateway } from '../../domain/gateways/users';
import { AuthService } from '../../../../core/auth/auth';
import { ToastService } from '../../../../shared/services/toast/toast';

type RegisterForm = {
  name: FormControl<string>;
  login: FormControl<string>;
  password: FormControl<string>;
};

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="flex min-h-[60vh] items-center justify-center px-4">
      <div class="w-full max-w-md rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 shadow-xl backdrop-blur-sm">
        <div class="mb-8 text-center">
          <h1 class="text-2xl font-bold text-white">Creer un compte</h1>
          <p class="mt-2 text-sm text-slate-400">Rejoignez la communaute</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <fieldset class="space-y-5">
            <legend class="sr-only">Informations du compte</legend>
            <div>
              <label for="name" class="mb-1 block text-sm font-medium text-slate-300">Nom</label>
              <input
                id="name"
                formControlName="name"
                class="w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2.5 text-sm text-white
                       placeholder-slate-500 transition-colors focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                placeholder="Votre nom complet"
              />
              @if (registerForm.controls.name.touched && registerForm.controls.name.errors?.['required']) {
                <small class="mt-1 block text-xs text-red-400">Le nom est obligatoire.</small>
              }
            </div>
            <div>
              <label for="login" class="mb-1 block text-sm font-medium text-slate-300">Identifiant</label>
              <input
                id="login"
                formControlName="login"
                class="w-full rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2.5 text-sm text-white
                       placeholder-slate-500 transition-colors focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                placeholder="Votre identifiant"
              />
              @if (registerForm.controls.login.touched && registerForm.controls.login.errors?.['required']) {
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
              @if (registerForm.controls.password.touched) {
                @if (registerForm.controls.password.errors?.['required']) {
                  <small class="mt-1 block text-xs text-red-400">Le mot de passe est obligatoire.</small>
                } @else if (registerForm.controls.password.errors?.['minlength']) {
                  <small class="mt-1 block text-xs text-red-400">Le mot de passe doit faire au minimum 3 caracteres.</small>
                }
              }
            </div>
          </fieldset>
          <button
            type="submit"
            [disabled]="registerForm.invalid"
            class="w-full rounded-lg bg-teal-600 py-2.5 text-sm font-medium text-white transition-all
                   hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Creer mon compte
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-slate-500">
          Deja un compte ?
          <a routerLink="/me/login" class="text-teal-400 hover:text-teal-300 transition-colors">Se connecter</a>
        </p>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private readonly usersGateway = inject(UsersGateway);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  protected readonly registerForm = new FormGroup<RegisterForm>({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    login: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
  });

  protected onSubmit(): void {
    if (this.registerForm.invalid) return;

    const { name, login, password } = this.registerForm.getRawValue();
    this.usersGateway.register({ name, login, password }).subscribe((user) => {
      this.authService.setUser(user);
      this.toastService.show('Compte cree avec succes !', 'success');
      this.router.navigate(['/me']);
    });
  }
}
