import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importar RouterModule para [routerLink]
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
  // *** Inyectar UserService ***
  private userService = inject(UserService);

  // *** Método para cerrar sesión ***
  logout(): void {
    this.userService.logout();
    // Opcional: Redirigir explícitamente si es necesario (aunque el guard ya debería hacerlo)
    // this.router.navigate(['/login']); 
  }
} 