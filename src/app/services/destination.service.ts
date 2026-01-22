import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Destination } from '../models/destination.model';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  private apiUrl = '/assets/data/destinations.json';

  constructor(private http: HttpClient) { }

  getDestinations(): Observable<Destination[]> {
    return this.http.get<Destination[]>(this.apiUrl);
  }

  getDestinationById(id: string): Observable<Destination> {
    return this.http.get<Destination[]>(this.apiUrl).pipe(
      map(destinations => destinations.find(d => d.id === id) as Destination)
    );
  }
}
