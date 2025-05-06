import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment'; // Asume que tienes environment

// Interfaz para la respuesta del login (ajusta según tu API)
interface LoginResponse {
  token: string;
  // otros datos del usuario si los devuelve
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loggedInStatus = new BehaviorSubject<boolean>(this.hasToken());

  // Observable público para que los componentes reaccionen al estado de login
  isLoggedIn$: Observable<boolean> = this.loggedInStatus.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Intenta iniciar sesión en el backend.
   * @param credentials Email y contraseña.
   * @returns Observable con la respuesta del servidor o un error.
   */
  login(credentials: { email: string, password: string }): Observable<LoginResponse | null> {
    const loginUrl = `${environment.apiUrl}/login`; 
    console.log('Attempting login to:', loginUrl); // Log para depuración
    return this.http.post<LoginResponse>(loginUrl, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('authToken', response.token);
          this.loggedInStatus.next(true); // Notificar que el usuario está logueado
          console.log('Login successful, token stored.');
        } else {
           // Manejar caso donde la respuesta es 200 pero no hay token?
           console.warn('Login response received, but no token found.');
           this.loggedInStatus.next(false);
        }
      }),
      catchError(error => {
        console.error('Login failed:', error);
        this.loggedInStatus.next(false); // Asegurarse que el estado es false en error
        localStorage.removeItem('authToken'); // Limpiar token si el login falla
        // Devolver un observable nulo o lanzar el error dependiendo de cómo lo manejes
        return of(null); 
      })
    );
  }

  /**
   * Cierra la sesión del usuario.
   */
  logout(): void {
    localStorage.removeItem('authToken');
    this.loggedInStatus.next(false);
    console.log('Logged out, token removed.');
    // Considera redirigir al login aquí o en el componente que llama a logout
    // this.router.navigate(['/login']); 
  }

  /**
   * Verifica si hay un token almacenado.
   * @returns true si existe un token, false en caso contrario.
   */
  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Obtiene el token de autenticación almacenado.
   * @returns El token o null si no existe.
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Devuelve el estado actual de autenticación (sincrónico).
   * Prefiere usar isLoggedIn$ para reactividad.
   */
  isAuthenticated(): boolean {
    return this.loggedInStatus.value;
  }

  // Aquí podrías añadir métodos para obtener datos del usuario logueado, etc.
}
