import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-booking-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './booking-confirmation-dialog.component.html',
  styleUrls: ['./booking-confirmation-dialog.component.css'],
})
export class BookingConfirmationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public readonly booking: Booking) {}
}
