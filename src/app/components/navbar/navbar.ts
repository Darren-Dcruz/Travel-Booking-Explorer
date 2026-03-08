import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs/operators';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class NavbarComponent {
  private readonly userService = inject(UserService);
  private readonly themeService = inject(ThemeService);

  readonly user$ = this.userService.getCurrentUser();
  readonly isLoggedIn$ = this.userService.isLoggedIn$;
  readonly isDarkTheme$ = this.themeService.theme$.pipe(map((theme) => theme === 'dark'));

  logout(): void {
    this.userService.logout();
  }

  loginDemo(): void {
    this.userService.loginDemoUser();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
