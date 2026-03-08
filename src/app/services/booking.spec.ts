import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BookingService } from './booking.service';
import { mockApiInterceptor } from '../interceptors/mock-api.interceptor';
import { Booking } from '../models/booking.model';
import { getSafeStorage } from '../utils/storage.util';

describe('BookingService', () => {
  let service: BookingService;

  beforeEach(() => {
    getSafeStorage().removeItem('travel-booking-store');

    TestBed.configureTestingModule({
      providers: [BookingService, provideHttpClient(withInterceptors([mockApiInterceptor]))],
    });

    service = TestBed.inject(BookingService);
  });

  it('adds and cancels bookings through the mock API interceptor', async () => {
    const booking: Booking = {
      id: 'booking-1',
      userId: 'user-1',
      packageId: 'pkg-1',
      destinationId: 'dest-1',
      packageName: 'Maldives Escape',
      destinationName: 'Maldives',
      travelers: 2,
      travelDate: '2026-07-21',
      totalPrice: 120000,
      status: 'confirmed',
      bookingDate: new Date().toISOString(),
    };

    await firstValueFrom(service.refreshBookings());

    let latestBookings = await firstValueFrom(service.getBookings());
    expect(latestBookings.length).toBe(0);

    await firstValueFrom(service.addBooking(booking));

    latestBookings = await firstValueFrom(service.getBookings());
    expect(latestBookings.length).toBe(1);
    expect(latestBookings[0].status).toBe('confirmed');

    await firstValueFrom(service.cancelBooking(booking.id));

    latestBookings = await firstValueFrom(service.getBookings());
    expect(latestBookings[0].status).toBe('cancelled');
  });
});
