import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

      
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user : any;
  //API: String = 'http://localhost:3050/';
  API: String = 'https://gentle-mountain-84308.herokuapp.com/';
  constructor(
    private http: HttpClient
  ) { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getDataUser(id:any):Observable<any>{
    return this.http.get(this.API+'dataUser/'+id);
  }

  public getUserLogin(form:any):Observable<any>{
    return this.http.post<any>(this.API+'dataUser/', form);
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }
}
