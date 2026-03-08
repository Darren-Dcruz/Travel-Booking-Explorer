import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { BookingFormComponent } from './booking-form';
import { PackageService } from '../../services/package.service';
import { BookingService } from '../../services/booking.service';
import { UserService } from '../../services/user.service';
import { DestinationService } from '../../services/destination.service';
import { NotificationService } from '../../services/notification.service';
import { Booking } from '../../models/booking.model';

describe('BookingFormComponent', () => {
  let component: BookingFormComponent;
  let fixture: ComponentFixture<BookingFormComponent>;
  let addBookingCallCount = 0;

  const bookingServiceMock = {
    addBooking: (booking: Booking) => {
      addBookingCallCount += 1;
      return of(booking);
    },
  };

  beforeEach(async () => {
    addBookingCallCount = 0;

    await TestBed.configureTestingModule({
      imports: [BookingFormComponent],
      providers: [
        provideNoopAnimations(),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: 'pkg-1' })),
          },
        },
        {
          provide: PackageService,
          useValue: {
            getPackageById: () =>
              of({
                id: 'pkg-1',
                destinationId: 'dest-1',
                name: 'Mock Package',
                duration: 5,
                price: 50000,
                description: 'desc',
                itinerary: ['day-1'],
                inclusions: ['Hotel'],
                category: 'leisure',
              }),
          },
        },
        {
          provide: DestinationService,
          useValue: {
            getDestinationById: () =>
              of({
                id: 'dest-1',
                name: 'Mock Destination',
                country: 'India',
                image: 'img',
                summary: 'summary',
                description: 'desc',
                rating: 4.5,
                reviews: 100,
              }),
          },
        },
        { provide: BookingService, useValue: bookingServiceMock },
        {
          provide: UserService,
          useValue: {
            getCurrentUser: () =>
              of({
                id: 'user-1',
                name: 'Test User',
                email: 'test@example.com',
                phone: '9876543210',
              }),
          },
        },
        {
          provide: NotificationService,
          useValue: {
            success: () => undefined,
            error: () => undefined,
          },
        },
        {
          provide: MatDialog,
          useValue: {
            open: () => ({
              afterClosed: () => of(true),
            }),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: () => Promise.resolve(true),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the booking form', () => {
    expect(component).toBeTruthy();
    expect(component.bookingForm).toBeTruthy();
  });

  it('rejects past travel date', () => {
    const travelDateControl = component.bookingForm.get('travelDate');

    travelDateControl?.setValue('2020-01-01');
    travelDateControl?.markAsTouched();

    expect(travelDateControl?.hasError('pastDate')).toBe(true);
  });

  it('submits when the form is valid', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);

    component.bookingForm.patchValue({
      name: 'Valid User',
      email: 'valid@example.com',
      phone: '9999999999',
      travelers: 2,
      travelDate: futureDate.toISOString().slice(0, 10),
      specialRequests: 'Window seat preferred',
    });

    component.onSubmit();

    expect(addBookingCallCount).toBe(1);
  });
});
