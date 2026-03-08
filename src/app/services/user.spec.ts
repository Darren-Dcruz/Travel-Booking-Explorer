import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { UserService } from './user.service';
import { getSafeStorage } from '../utils/storage.util';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    getSafeStorage().removeItem('travel-booking-user');
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('initializes with demo login', async () => {
    const user = await firstValueFrom(service.getCurrentUser());
    expect(user?.id).toBe('user-1');
  });

  it('registers and updates current user', async () => {
    await firstValueFrom(
      service.register({
        name: 'Test User',
        email: 'test@example.com',
        phone: '9999999999',
        preferredTravelStyle: 'Adventure',
      }),
    );

    const user = await firstValueFrom(service.getCurrentUser());
    expect(user?.email).toBe('test@example.com');
  });
});
