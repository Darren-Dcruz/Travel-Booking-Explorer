import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  getCurrentUser(): Observable<User> {
    return of({
      id: 'user-1',
    name: 'Napoleon Bonaparte',
      email: 'emperoroffrance@example.com',
      phone: '987-654-3210'
    });
  }
}
