import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, RegistrationRequest } from '../models/user.model';
import { getSafeStorage } from '../utils/storage.util';

const USER_STORAGE_KEY = 'travel-booking-user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly storage = getSafeStorage();

  private readonly demoUser: User = {
    id: 'user-1',
    name: 'Demo Traveler',
    email: 'demo.traveler@example.com',
    phone: '9876543210',
    preferredTravelStyle: 'Leisure',
  };

  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);

  readonly currentUser$ = this.currentUserSubject.asObservable();
  readonly isLoggedIn$ = this.currentUser$.pipe(map((user) => Boolean(user)));

  constructor() {
    this.restoreUser();
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  register(payload: RegistrationRequest): Observable<User> {
    const user: User = {
      id: `user-${Date.now()}`,
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim(),
      preferredTravelStyle: payload.preferredTravelStyle,
    };

    this.currentUserSubject.next(user);
    this.storage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

    return of(user);
  }

  loginDemoUser(): void {
    this.currentUserSubject.next(this.demoUser);
    this.storage.setItem(USER_STORAGE_KEY, JSON.stringify(this.demoUser));
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.storage.removeItem(USER_STORAGE_KEY);
  }

  private restoreUser(): void {
    const storedValue = this.storage.getItem(USER_STORAGE_KEY);

    if (storedValue) {
      try {
        this.currentUserSubject.next(JSON.parse(storedValue) as User);
        return;
      } catch {
        this.storage.removeItem(USER_STORAGE_KEY);
      }
    }

    this.loginDemoUser();
  }
}
