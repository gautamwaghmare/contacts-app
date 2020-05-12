import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';
import { environment } from './../../environments/environment';

const BACKEND_URL = environment.apiUrl + "/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string;
  private tokenTimer: any;
  private isAuthenticated = false;
  private userId: string;
  private authStatusListner = new Subject<boolean>();

  constructor(private http: HttpClient, private router:Router) { }

  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getAuthStatusListner(){
    return this.authStatusListner.asObservable();
  }

  getUserId(){
    return this.userId;
  }

  createUser(email: string, password: string){
    const authData: AuthData = {email: email, password: password};
    this.http.post(BACKEND_URL + '/signup', authData)
      .subscribe(response => {
        console.log(response);
        this.router.navigate(["/login"]);
      }, error => {
        this.authStatusListner.next(false);
      });
  }

  login(email: string, password: string){
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string, expiresIn: number, userId: string}>(BACKEND_URL + '/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if(this.token){
          const expiresIn = response.expiresIn;
          this.setAuthTimer(expiresIn);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListner.next(true);
          const expiresOn = new Date(new Date().getTime() + expiresIn * 1000);
          this.saveAuthData(token, expiresOn, this.userId);
          this.router.navigate(["/"]);
        }
      }, error => {
          this.authStatusListner.next(false);
      });
  }

  autoLoginUser(){
    const authInfo = this.getAuthData();
    if(!authInfo){
      return;
    }
    const expiresIn = authInfo.expiresOn.getTime() - new Date().getTime();
    if(expiresIn > 0){
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListner.next(true);
    }
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListner.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private setAuthTimer(expiresIn){
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresIn * 1000);
  }

  private saveAuthData(token: string, expiresOn: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiresOn', expiresOn.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiresOn');
    localStorage.removeItem('userId');
  }

  private getAuthData(){
    const token = localStorage.getItem('token');
    const expiresOn = localStorage.getItem('expiresOn');
    const userId = localStorage.getItem('userId');
    if(!token || !expiresOn){
      return;
    }
    return {
      token: token,
      expiresOn: new Date(expiresOn),
      userId: userId
    }
  }

}
