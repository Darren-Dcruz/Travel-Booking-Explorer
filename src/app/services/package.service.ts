import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Package } from '../models/package.model';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private apiUrl = '/assets/data/packages.json';

  constructor(private http: HttpClient) { }

  getPackages(): Observable<Package[]> {
    return this.http.get<Package[]>(this.apiUrl);
  }

  getPackagesByDestination(destinationId: string): Observable<Package[]> {
    return this.http.get<Package[]>(this.apiUrl).pipe(
      map(packages => packages.filter(p => p.destinationId === destinationId))
    );
  }

  getPackageById(id: string): Observable<Package> {
    return this.http.get<Package[]>(this.apiUrl).pipe(
      map(packages => packages.find(p => p.id === id) as Package)
    );
  }
}
