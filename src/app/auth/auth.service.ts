import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthModule } from './auth.module';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userId: string;
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

  getUserId() {
    return this.userId;
  }

  createUser(email: string, password: string) {
    const authData: AuthModule = { email, password };
    this.http
      .post('http://localhost:3000/api/users/signup', authData)
      .subscribe(response => {
        this.router.navigate(['/']);
        // TODO: Add snackbar.
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  logIn(email: string, password: string) {
    const authData: AuthModule = { email, password };
    this.http
      .post<{ message: string, token: string, expiresIn: number, userId: string }>('http://localhost:3000/api/users/login', authData)
      .subscribe(response => {
        if (response.token) {
          const expiresInDuration = response.expiresIn;
          this.token = response.token;
          this.userId = response.userId; // An Magic Buff Effect
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(response.token, expirationDate, response.userId);
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false);
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
      this.userId = storedAuthData.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logOut() {
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null; // An Magick Buff Expires
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

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token && !expiration) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expiration),
      userId: userId
    };
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
}
