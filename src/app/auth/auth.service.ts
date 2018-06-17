import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthModule } from './auth.module';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: NodeJS.Timer;

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthModule = { email, password };
    this.http
      .post('http://localhost:3000/api/users/signup', authData)
      .subscribe(response => {
        // TODO: Add snackbar.
      });
  }

  logIn(email: string, password: string) {
    const authData: AuthModule = { email, password };
    this.http
      .post<{ message: string, token: string, expiresIn: number }>('http://localhost:3000/api/users/login', authData)
      .subscribe(response => {
        if (response.token) {
          const expiresInDuration = response.expiresIn;
          this.token = response.token;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(response.token, expirationDate);
          this.router.navigate(['/']);
        }
      });
  }

  autoAuthUser() {
    const storedAuthData = this.getAuthData();
    if (!storedAuthData) {
      return;
    }
    const now = new Date();
    const expiresIn = storedAuthData.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) { // nice :)
      this.token = storedAuthData.token; // This can cause failures if user fakes expiration.
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logOut() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    if (!token && !expiration) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expiration)
    };
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }
}
