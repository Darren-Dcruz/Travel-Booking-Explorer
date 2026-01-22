import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { UserService } from '../../services/user.service';
import { Booking } from '../../models/booking.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css']
})
export class UserDashboardComponent implements OnInit {
  bookings: Booking[] = [];
  user: User | undefined;
  selectedFilter: string = 'all';

  constructor(
    private bookingService: BookingService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
    });

    this.bookingService.getBookings().subscribe(bookings => {
      this.bookings = bookings;
    });
  }

  get filteredBookings(): Booking[] {
    if (this.selectedFilter === 'all') {
      return this.bookings;
    }
    return this.bookings.filter(b => b.status === this.selectedFilter);
  }

  cancelBooking(bookingId: string): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(bookingId);
    }
  }

  setFilter(filter: string): void {
    this.selectedFilter = filter;
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'confirmed': return 'green';
      case 'pending': return 'orange';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  }
}
