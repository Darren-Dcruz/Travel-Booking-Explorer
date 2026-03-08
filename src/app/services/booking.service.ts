import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Booking } from '../models/booking.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly bookingsApiUrl = '/mock-api/bookings';
  private readonly bookingsSubject = new BehaviorSubject<Booking[]>([]);

  readonly bookings$ = this.bookingsSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    this.refreshBookings().subscribe();
  }

  refreshBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.bookingsApiUrl).pipe(
      catchError(() => of([])),
      tap((bookings) => this.bookingsSubject.next(bookings)),
    );
  }

  getBookings(): Observable<Booking[]> {
    return this.bookings$;
  }

  getBookingsByUser(userId: string): Observable<Booking[]> {
    return this.bookings$.pipe(map((bookings) => bookings.filter((booking) => booking.userId === userId)));
  }

  addBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.bookingsApiUrl, booking).pipe(
      tap((savedBooking) => {
        this.bookingsSubject.next([savedBooking, ...this.bookingsSubject.value]);
      }),
    );
  }

  cancelBooking(bookingId: string): Observable<Booking> {
    return this.http
      .patch<Booking>(`${this.bookingsApiUrl}/${bookingId}`, {
        status: 'cancelled',
      })
      .pipe(
        tap((updatedBooking) => {
          const nextBookings = this.bookingsSubject.value.map((booking) =>
            booking.id === bookingId ? { ...booking, status: updatedBooking.status } : booking,
          );

          this.bookingsSubject.next(nextBookings);
        }),
      );
  }
}
