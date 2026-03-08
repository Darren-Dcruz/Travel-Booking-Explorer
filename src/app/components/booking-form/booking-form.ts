import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PackageService } from '../../services/package.service';
import { BookingService } from '../../services/booking.service';
import { UserService } from '../../services/user.service';
import { DestinationService } from '../../services/destination.service';
import { NotificationService } from '../../services/notification.service';
import { Package } from '../../models/package.model';
import { Booking } from '../../models/booking.model';
import { User } from '../../models/user.model';
import { BookingConfirmationDialogComponent } from '../booking-confirmation-dialog/booking-confirmation-dialog.component';

function travelDateRangeValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return null;
  }

  const selectedDate = new Date(value);

  if (Number.isNaN(selectedDate.getTime())) {
    return { invalidDate: true };
  }

  selectedDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date(today);
  maxDate.setFullYear(today.getFullYear() + 1);

  if (selectedDate < today) {
    return { pastDate: true };
  }

  if (selectedDate > maxDate) {
    return { tooFar: true };
  }

  return null;
}

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './booking-form.html',
  styleUrls: ['./booking-form.css'],
})
export class BookingFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly packageService = inject(PackageService);
  private readonly bookingService = inject(BookingService);
  private readonly userService = inject(UserService);
  private readonly destinationService = inject(DestinationService);
  private readonly notifications = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  readonly travelerOptions = Array.from({ length: 10 }, (_, index) => index + 1);
  readonly minTravelDate = new Date();
  readonly maxTravelDate = (() => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    return maxDate;
  })();

  bookingForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    travelers: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
    travelDate: ['', [Validators.required, travelDateRangeValidator]],
    specialRequests: [''],
  });

  packageData: Package | undefined;
  currentUser: User | null = null;
  destinationName = '';

  isSubmitting = false;

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;

      if (!user) {
        return;
      }

      this.bookingForm.patchValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
    });

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const packageId = params.get('id');
          return packageId ? this.packageService.getPackageById(packageId) : of(undefined);
        }),
        tap((travelPackage) => {
          this.packageData = travelPackage;
        }),
        switchMap((travelPackage) =>
          travelPackage
            ? this.destinationService.getDestinationById(travelPackage.destinationId)
            : of(undefined),
        ),
      )
      .subscribe((destination) => {
        this.destinationName = destination?.name ?? '';
      });
  }

  get totalPrice(): number {
    if (!this.packageData) {
      return 0;
    }

    const travelers = Number(this.bookingForm.get('travelers')?.value ?? 1);
    return this.packageData.price * travelers;
  }

  controlError(controlName: string): ValidationErrors | null {
    const control = this.bookingForm.get(controlName);

    if (!control || !control.touched || !control.invalid) {
      return null;
    }

    return control.errors;
  }

  onSubmit(): void {
    if (this.bookingForm.invalid || !this.packageData || !this.currentUser) {
      this.bookingForm.markAllAsTouched();
      this.notifications.error('Please fix validation errors before submitting.');
      return;
    }

    this.isSubmitting = true;

    const booking: Booking = {
      id: `booking-${Date.now()}`,
      userId: this.currentUser.id,
      packageId: this.packageData.id,
      destinationId: this.packageData.destinationId,
      packageName: this.packageData.name,
      destinationName: this.destinationName,
      travelers: Number(this.bookingForm.value.travelers),
      travelDate: this.serializeTravelDate(this.bookingForm.value.travelDate),
      totalPrice: this.totalPrice,
      specialRequests: String(this.bookingForm.value.specialRequests || '').trim(),
      status: 'confirmed',
      bookingDate: new Date().toISOString(),
    };

    this.bookingService.addBooking(booking).subscribe({
      next: (savedBooking) => {
        this.isSubmitting = false;
        this.notifications.success('Booking created successfully.');

        this.dialog
          .open(BookingConfirmationDialogComponent, {
            data: savedBooking,
            disableClose: true,
          })
          .afterClosed()
          .subscribe(() => {
            this.router.navigate(['/dashboard']);
          });
      },
      error: () => {
        this.isSubmitting = false;
        this.notifications.error('Booking failed. Please try once again.');
      },
    });
  }

  cancel(): void {
    if (!this.packageData) {
      this.router.navigate(['/destinations']);
      return;
    }

    this.router.navigate(['/package', this.packageData.id, 'overview']);
  }

  private serializeTravelDate(value: unknown): string {
    if (value instanceof Date) {
      return value.toISOString().slice(0, 10);
    }

    const parsedDate = new Date(String(value));
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString().slice(0, 10);
    }

    return String(value);
  }
}
