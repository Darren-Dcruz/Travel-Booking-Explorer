import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getSafeStorage } from '../utils/storage.util';

export type AppTheme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'travel-booking-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storage = getSafeStorage();
  private readonly themeSubject = new BehaviorSubject<AppTheme>('light');

  readonly theme$ = this.themeSubject.asObservable();

  constructor() {
    const storedTheme = this.storage.getItem(THEME_STORAGE_KEY);
    const initialTheme: AppTheme = storedTheme === 'dark' ? 'dark' : 'light';
    this.setTheme(initialTheme);
  }

  get currentTheme(): AppTheme {
    return this.themeSubject.value;
  }

  toggleTheme(): void {
    const nextTheme: AppTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(nextTheme);
  }

  setTheme(theme: AppTheme): void {
    this.themeSubject.next(theme);
    this.storage.setItem(THEME_STORAGE_KEY, theme);

    const bodyElement = globalThis.document?.body;
    if (bodyElement) {
      bodyElement.classList.toggle('dark-theme', theme === 'dark');
    }
  }
}
