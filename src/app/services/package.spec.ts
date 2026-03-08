import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PackageService } from './package.service';

describe('PackageService', () => {
  let service: PackageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PackageService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(PackageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('filters packages by destination id', () => {
    const mockPackages = [
      {
        id: 'pkg-1',
        destinationId: 'dest-1',
        name: 'Package One',
        image: 'https://picsum.photos/seed/pkg-1/1200/800',
        duration: 4,
        price: 1000,
        description: 'a',
        itinerary: ['day'],
        inclusions: ['hotel'],
        category: 'leisure',
      },
      {
        id: 'pkg-2',
        destinationId: 'dest-2',
        name: 'Package Two',
        image: 'https://picsum.photos/seed/pkg-2/1200/800',
        duration: 5,
        price: 2000,
        description: 'b',
        itinerary: ['day'],
        inclusions: ['hotel'],
        category: 'adventure',
      },
    ];

    service.getPackagesByDestination('dest-1').subscribe((packages) => {
      expect(packages.length).toBe(1);
      expect(packages[0].id).toBe('pkg-1');
    });

    const request = httpMock.expectOne('assets/data/packages.json');
    expect(request.request.method).toBe('GET');
    request.flush(mockPackages);
  });
});
