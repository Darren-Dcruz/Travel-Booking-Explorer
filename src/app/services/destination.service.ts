import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { Destination } from '../models/destination.model';

@Injectable({
  providedIn: 'root',
})
export class DestinationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'assets/data/destinations.json';

  private readonly destinations$ = this.http.get<Destination[]>(this.apiUrl).pipe(
    catchError(() => of([])),
    shareReplay(1),
  );

  getDestinations(): Observable<Destination[]> {
    return this.destinations$;
  }

  getDestinationById(id: string): Observable<Destination | undefined> {
    return this.destinations$.pipe(map((destinations) => destinations.find((item) => item.id === id)));
  }
}
