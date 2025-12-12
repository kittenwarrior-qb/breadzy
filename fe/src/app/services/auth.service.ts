import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { CartService } from './cart.service';

interface LoginResponse {
  msg: string;
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    role: string;
  };
}

interface RegisterResponse {
  msg: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5050/api/auth';

  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private emailKey = 'auth_email';
  private roleKey = 'auth_role';

  email$ = new BehaviorSubject<string | null>(this.getEmail());
  isLoggedIn$ = new BehaviorSubject<boolean>(!!this.getToken());
  cartItems$ = new BehaviorSubject<any[]>(this.getCartFromStorage());

  constructor(private http: HttpClient,private cartService: CartService) {}

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials);
  }

  register(data: { username: string; email: string; password: string }): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, data);
  }

  logout(): Observable<{ message: string }> {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.emailKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem('my_cart');

    this.cartService.clearCart(); 
    this.email$.next(null);
    this.isLoggedIn$.next(false);
    return this.http.post<{ message: string }>(`${this.apiUrl}/logout`, {});
  }

  setAuthData(accessToken: string, email: string, role: string, refreshToken?: string) {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.emailKey, email);
    localStorage.setItem(this.roleKey, role);
    if (refreshToken) {
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
    this.email$.next(email);
    this.isLoggedIn$.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  getEmail(): string | null {
    return localStorage.getItem(this.emailKey);
  }

  getRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  getCartFromStorage(): any[] {
    const raw = localStorage.getItem('my_cart');
    return raw ? JSON.parse(raw) : [];
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
