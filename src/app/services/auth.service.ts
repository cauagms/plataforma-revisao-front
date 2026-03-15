import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { environment } from '../env/environment';
import { LoginRequest, RegisterRequest, TokenResponse, User } from '../models/auth.model';

const TOKEN_KEY = 'access_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private readonly isBrowser: boolean;

  usuario = signal<User | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  }

  login(data: LoginRequest): Observable<User> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/auth/login`, data).pipe(
      tap((res) => this.setToken(res.access_token)),
      switchMap(() => this.me()),
      tap((user) => {
        this.usuario.set(user);
        const destino = user.role === 'professor' ? '/dashboard-professor' : '/home';
        this.router.navigate([destino]);
      })
    );
  }

  register(data: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/auth/register`, data).pipe(
      switchMap(() => {
        return this.login({ email: data.email, senha: data.senha });
      })
    );
  }

  logout(): void {
    this.usuario.set(null);
    this.removeToken();
    this.router.navigate(['/login']);
  }

  me(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/me`);
  }

  atualizarNome(nome: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/me`, { nome }).pipe(
      tap((user) => this.usuario.set(user))
    );
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setToken(token: string): void {
    if (!this.isBrowser) return;
    localStorage.setItem(TOKEN_KEY, token);
  }

  private removeToken(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(TOKEN_KEY);
  }
}
