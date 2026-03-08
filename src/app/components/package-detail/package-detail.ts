import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { PackageService } from '../../services/package.service';
import { DestinationService } from '../../services/destination.service';
import { Package } from '../../models/package.model';
import { Destination } from '../../models/destination.model';

@Component({
  selector: 'app-package-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatIconModule, MatTabsModule],
  templateUrl: './package-detail.html',
  styleUrls: ['./package-detail.css'],
})
export class PackageDetailComponent implements OnInit {
  packageData: Package | undefined;
  destination: Destination | undefined;

  loading = true;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly packageService: PackageService,
    private readonly destinationService: DestinationService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const packageId = params.get('id');

          if (!packageId) {
            return of([undefined, undefined] as [Package | undefined, Destination | undefined]);
          }

          return this.packageService.getPackageById(packageId).pipe(
            switchMap((travelPackage) => {
              if (!travelPackage) {
                return of([undefined, undefined] as [Package | undefined, Destination | undefined]);
              }

              return combineLatest([
                of(travelPackage),
                this.destinationService.getDestinationById(travelPackage.destinationId),
              ]);
            }),
          );
        }),
        catchError(() => {
          this.errorMessage = 'Unable to load package details.';
          return of([undefined, undefined] as [Package | undefined, Destination | undefined]);
        }),
      )
      .subscribe(([travelPackage, destination]) => {
        this.packageData = travelPackage;
        this.destination = destination;
        this.loading = false;

        if (!this.packageData && !this.errorMessage) {
          this.errorMessage = 'Requested package was not found.';
        }
      });
  }

  bookNow(): void {
    if (!this.packageData) {
      return;
    }

    this.router.navigate(['/booking', this.packageData.id]);
  }
}
