import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PackageService } from '../../services/package.service';
import { BookingService } from '../../services/booking.service';
import { UserService } from '../../services/user.service';
import { Package } from '../../models/package.model';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './booking-form.html',
  styleUrls: ['./booking-form.css']
})
export class BookingFormComponent implements OnInit {
  bookingForm!: FormGroup;
  package: Package | undefined;
  currentUser: any;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private packageService: PackageService,
    private bookingService: BookingService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Get current user
    this.userService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });

    // Get package details
    const packageId = this.route.snapshot.paramMap.get('id');
    if (packageId) {
      this.packageService.getPackageById(packageId).subscribe(pkg => {
        this.package = pkg;
      });
    }

    // Initialize form with validation
    this.bookingForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      travelers: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      travelDate: ['', Validators.required],
      specialRequests: ['']
    });
  }

  get totalPrice(): number {
    if (!this.package) return 0;
    const travelers = this.bookingForm.get('travelers')?.value || 1;
    return this.package.price * travelers;
  }

  onSubmit(): void {
    if (this.bookingForm.valid && this.package && this.currentUser) {
      this.isSubmitting = true;

      const booking: Booking = {
        id: 'booking-' + Date.now(),
        userId: this.currentUser.id,
        packageId: this.package.id,
        destinationId: this.package.destinationId,
        packageName: this.package.name,
        destinationName: '',
        travelers: this.bookingForm.value.travelers,
        travelDate: this.bookingForm.value.travelDate,
        totalPrice: this.totalPrice,
        status: 'confirmed',
        bookingDate: new Date().toISOString()
      };

      this.bookingService.addBooking(booking);

      setTimeout(() => {
        this.isSubmitting = false;
        alert('Booking confirmed! 🎉');
        this.router.navigate(['/my-bookings']);
      }, 1000);
    } else {
      alert('Please fill all required fields correctly.');
    }
  }

  cancel(): void {
    this.router.navigate(['/packages', this.package?.id]);
  }
}
