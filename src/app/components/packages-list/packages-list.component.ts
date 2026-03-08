import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PackageService } from '../../services/package.service';
import { DestinationService } from '../../services/destination.service';
import { Package } from '../../models/package.model';
import { Destination } from '../../models/destination.model';
import { HighlightOfferDirective } from '../../directives/highlight-offer.directive';

@Component({
  selector: 'app-packages-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    HighlightOfferDirective,
  ],
  templateUrl: './packages-list.component.html',
  styleUrls: ['./packages-list.component.css'],
})
export class PackagesListComponent implements OnInit {
  packages: Package[] = [];
  destination: Destination | undefined;

  selectedCategory = 'all';
  categories: string[] = [];

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
          const destinationId = params.get('id');

          if (!destinationId) {
            return of([undefined, []] as [Destination | undefined, Package[]]);
          }

          return combineLatest([
            this.destinationService.getDestinationById(destinationId),
            this.packageService.getPackagesByDestination(destinationId),
          ]);
        }),
        catchError(() => {
          this.errorMessage = 'Unable to load travel packages.';
          return of([undefined, []] as [Destination | undefined, Package[]]);
        }),
      )
      .subscribe(([destination, packages]) => {
        this.destination = destination;
        this.packages = packages;
        this.categories = Array.from(new Set(packages.map((travelPackage) => travelPackage.category))).sort();
        this.loading = false;
      });
  }

  get filteredPackages(): Package[] {
    if (this.selectedCategory === 'all') {
      return this.packages;
    }

    return this.packages.filter((travelPackage) => travelPackage.category === this.selectedCategory);
  }

  viewPackageDetail(packageId: string): void {
    this.router.navigate(['/package', packageId, 'overview']);
  }
}
