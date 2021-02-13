import { Injectable } from '@angular/core';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() { }

  setUserLoggedIn(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    console.log('[UserService] saved on localStorage');
  }

  getUserLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  clearLocalStorage(): void{
    localStorage.clear();
  }

}
