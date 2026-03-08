import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Booking } from '../models/booking.model';
import { getSafeStorage } from '../utils/storage.util';

const BOOKING_STORAGE_KEY = 'travel-booking-store';
const storage = getSafeStorage();

function readBookings(): Booking[] {
  const storedValue = storage.getItem(BOOKING_STORAGE_KEY);

  if (!storedValue) {
    return [];
  }

  try {
    return JSON.parse(storedValue) as Booking[];
  } catch {
    storage.removeItem(BOOKING_STORAGE_KEY);
    return [];
  }
}

function writeBookings(bookings: Booking[]): void {
  storage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookings));
}

function handleMockBookingsRequest(req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
  if (req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: readBookings() })).pipe(delay(250));
  }

  if (req.method === 'POST') {
    const incomingBooking = req.body as Booking;
    const currentBookings = readBookings();

    writeBookings([incomingBooking, ...currentBookings]);

    return of(new HttpResponse({ status: 201, body: incomingBooking })).pipe(delay(350));
  }

  if (req.method === 'PATCH') {
    const bookingId = req.url.split('/').pop();
    const patchBody = req.body as Partial<Booking>;

    const updatedBookings = readBookings().map((booking) =>
      booking.id === bookingId ? { ...booking, ...patchBody } : booking,
    );

    const updatedBooking =
      updatedBookings.find((booking) => booking.id === bookingId) ??
      ({
        id: bookingId ?? 'unknown-booking',
        status: patchBody.status ?? 'cancelled',
      } as Partial<Booking>);

    writeBookings(updatedBookings);

    return of(new HttpResponse({ status: 200, body: updatedBooking })).pipe(delay(250));
  }

  return of(new HttpResponse({ status: 405, body: { message: 'Unsupported method for mock API.' } }));
}

export const mockApiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  if (!req.url.startsWith('/mock-api/bookings')) {
    return next(req);
  }

  return handleMockBookingsRequest(req);
};
