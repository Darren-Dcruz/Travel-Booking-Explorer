import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { Package } from '../models/package.model';
import { PackageReview } from '../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'assets/data/packages.json';

  private readonly packages$ = this.http.get<Package[]>(this.apiUrl).pipe(
    catchError(() => of([])),
    shareReplay(1),
  );

  getPackages(): Observable<Package[]> {
    return this.packages$;
  }

  getPackagesByDestination(destinationId: string): Observable<Package[]> {
    return this.packages$.pipe(
      map((packages) => packages.filter((item) => item.destinationId === destinationId)),
    );
  }

  getPackageById(id: string): Observable<Package | undefined> {
    return this.packages$.pipe(map((packages) => packages.find((item) => item.id === id)));
  }

  getStartingPriceForDestination(destinationId: string): Observable<number | null> {
    return this.getPackagesByDestination(destinationId).pipe(
      map((packages) => {
        if (!packages.length) {
          return null;
        }

        return Math.min(...packages.map((item) => item.price));
      }),
    );
  }

  getPackageReviews(packageId: string): Observable<PackageReview[]> {
    const mockReviews: PackageReview[] = [
      {
        id: `${packageId}-review-1`,
        packageId,
        author: 'Aarav M.',
        comment: 'Great itinerary planning and smooth hotel check-ins.',
        rating: 5,
        date: '2026-01-12T08:30:00.000Z',
      },
      {
        id: `${packageId}-review-2`,
        packageId,
        author: 'Nisha K.',
        comment: 'Value for money package, guide support was excellent.',
        rating: 4,
        date: '2025-12-04T10:15:00.000Z',
      },
      {
        id: `${packageId}-review-3`,
        packageId,
        author: 'Rahul P.',
        comment: 'Booking process was fast and real-time updates were helpful.',
        rating: 4,
        date: '2025-11-02T06:20:00.000Z',
      },
    ];

    return of(mockReviews);
  }
}
