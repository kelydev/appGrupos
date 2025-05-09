import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; // Importar Router
import { CommonModule } from '@angular/common'; // Importar CommonModule para *ngIf, etc.
import { UserService } from '../../api/user.service'; // Importar UserService
// Importar AuthService si se necesita para el botón de logout
// import { AuthService } from '../../api/auth.service'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule 
    // Otros módulos necesarios, como Material/PrimeNG si se usan para UI
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  // Hacer público para el template
  public userService = inject(UserService);
  private router = inject(Router);

  // *** Método para cerrar sesión ***
  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  // Método para obtener el nombre del usuario desde el JWT
  getUserName(): string | null {
    const token = this.userService.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Ajusta el campo según cómo venga en tu JWT
      return payload.nombre || payload.name || payload.username || null;
    } catch {
      return null;
    }
  }
} 