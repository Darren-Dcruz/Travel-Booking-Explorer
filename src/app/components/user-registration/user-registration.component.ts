import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css'],
})
export class UserRegistrationComponent {
  readonly travelStyles = ['Leisure', 'Adventure', 'Cultural', 'Family', 'Luxury'];

  model = {
    name: '',
    email: '',
    phone: '',
    preferredTravelStyle: 'Leisure',
    acceptTerms: false,
  };

  isSubmitting = false;

  constructor(
    private readonly userService: UserService,
    private readonly notifications: NotificationService,
    private readonly router: Router,
  ) {}

  onSubmit(form: NgForm): void {
    if (form.invalid || !this.model.acceptTerms) {
      form.control.markAllAsTouched();
      this.notifications.error('Please complete all required fields.');
      return;
    }

    this.isSubmitting = true;

    this.userService
      .register({
        name: this.model.name,
        email: this.model.email,
        phone: this.model.phone,
        preferredTravelStyle: this.model.preferredTravelStyle,
      })
      .subscribe(() => {
        this.isSubmitting = false;
        this.notifications.success('Registration successful.');
        this.router.navigate(['/dashboard']);
      });
  }
}
