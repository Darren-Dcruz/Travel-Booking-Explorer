import { Injectable } from '@angular/core';
import { Booking } from '../models/booking.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookings: Booking[] = [];

  constructor() {
    this.loadBookings();
  }

  private loadBookings(): void {
    const stored = localStorage.getItem('bookings');
    if (stored) {
      this.bookings = JSON.parse(stored);
    }
  }

  private saveBookings(): void {
    localStorage.setItem('bookings', JSON.stringify(this.bookings));
  }

  addBooking(booking: Booking): void {
    this.bookings.push(booking);
    this.saveBookings();
  }

  getBookings(): Observable<Booking[]> {
    return of(this.bookings);
  }

  cancelBooking(bookingId: string): void {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = 'cancelled';
      this.saveBookings();
    }
  }
}
