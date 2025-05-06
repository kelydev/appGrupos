import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../api/user.service';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.scss'
})
export class UserLoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  loading = false;
  loginError: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    if (this.userService.isAuthenticated()) {
        this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.loginError = null;

    if (this.loginForm.invalid) {
      console.log('Formulario inválido');
      return;
    }

    this.loading = true;
    const credentials = this.loginForm.value;
    console.log('Intentando iniciar sesión con:', credentials);

    this.userService.login(credentials)
      .subscribe({
        next: (response) => {
          if (response && response.token) {
            console.log('Login exitoso, redirigiendo...');
            this.router.navigate(['/']);
          } else {
            this.loginError = 'Respuesta inesperada del servidor. Intente de nuevo.';
            console.warn('Login OK pero respuesta inesperada:', response);
            this.loading = false;
          }
        },
        error: (error) => {
          this.loginError = 'Correo electrónico o contraseña incorrectos.';
          this.loading = false;
        }
      });
  }
}
