import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { DestinationService } from './destination.service';

describe('DestinationService', () => {
  let service: DestinationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DestinationService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(DestinationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads destinations from the asset json', () => {
    const mockDestinations = [
      {
        id: 'dest-1',
        name: 'Maldives',
        country: 'Maldives',
        image: 'img',
        summary: 'summary',
        description: 'description',
        rating: 4.8,
        reviews: 150,
      },
    ];

    service.getDestinations().subscribe((destinations) => {
      expect(destinations.length).toBe(1);
      expect(destinations[0].id).toBe('dest-1');
    });

    const request = httpMock.expectOne('assets/data/destinations.json');
    expect(request.request.method).toBe('GET');
    request.flush(mockDestinations);
  });
});
