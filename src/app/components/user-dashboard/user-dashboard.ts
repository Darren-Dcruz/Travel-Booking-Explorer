import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { combineLatest } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { BookingService } from '../../services/booking.service';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { Booking } from '../../models/booking.model';
import { User } from '../../models/user.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

type BookingFilter = 'all' | 'confirmed' | 'pending' | 'cancelled';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css'],
})
export class UserDashboardComponent implements OnInit {
  displayedColumns: string[] = ['packageName', 'travelDate', 'travelers', 'totalPrice', 'status', 'actions'];

  user: User | null = null;
  userBookings: Booking[] = [];

  selectedFilter: BookingFilter = 'all';

  constructor(
    private readonly bookingService: BookingService,
    private readonly userService: UserService,
    private readonly notifications: NotificationService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    combineLatest([this.userService.getCurrentUser(), this.bookingService.getBookings()]).subscribe(
      ([user, bookings]) => {
        this.user = user;

        if (!user) {
          this.userBookings = [];
          return;
        }

        this.userBookings = bookings.filter((booking) => booking.userId === user.id);
      },
    );
  }

  get filteredBookings(): Booking[] {
    if (this.selectedFilter === 'all') {
      return this.userBookings;
    }

    return this.userBookings.filter((booking) => booking.status === this.selectedFilter);
  }

  onTabChange(index: number): void {
    const filterByIndex: BookingFilter[] = ['all', 'confirmed', 'pending', 'cancelled'];
    this.selectedFilter = filterByIndex[index] ?? 'all';
  }

  cancelBooking(booking: Booking): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Cancel Booking',
          message: `Do you want to cancel booking ${booking.id}?`,
          confirmLabel: 'Cancel Booking',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }

        this.bookingService.cancelBooking(booking.id).subscribe({
          next: () => {
            this.notifications.success('Booking cancelled successfully.');
          },
          error: () => {
            this.notifications.error('Could not cancel booking.');
          },
        });
      });
  }

  statusClass(status: Booking['status']): string {
    if (status === 'confirmed') {
      return 'status-confirmed';
    }

    if (status === 'pending') {
      return 'status-pending';
    }

    return 'status-cancelled';
  }
}
