import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DestinationService } from '../../services/destination.service';
import { PackageService } from '../../services/package.service';
import { Destination } from '../../models/destination.model';
import { Package } from '../../models/package.model';
import { HighlightOfferDirective } from '../../directives/highlight-offer.directive';

@Component({
  selector: 'app-destination-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    HighlightOfferDirective,
  ],
  templateUrl: './destination-list.html',
  styleUrls: ['./destination-list.css'],
})
export class DestinationListComponent implements OnInit {
  private readonly fallbackBaseUrl = 'https://picsum.photos/seed';

  destinations: Destination[] = [];
  countries: string[] = [];

  searchQuery = '';
  selectedCountry = 'all';
  maxBudget: number | null = null;
  minRating = 4;

  readonly budgetOptions = [50000, 75000, 100000, 150000];
  readonly ratingOptions = [4, 4.3, 4.5, 4.8];

  loading = true;
  errorMessage = '';

  constructor(
    private readonly destinationService: DestinationService,
    private readonly packageService: PackageService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    combineLatest([this.destinationService.getDestinations(), this.packageService.getPackages()])
      .pipe(
        catchError(() => {
          this.errorMessage = 'Unable to load destinations right now.';
          return of([[], []] as [Destination[], Package[]]);
        }),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe(([destinations, packages]) => {
        const startingPriceByDestination = new Map<string, number>();

        packages.forEach((travelPackage) => {
          const existingPrice = startingPriceByDestination.get(travelPackage.destinationId);
          const nextPrice =
            existingPrice === undefined ? travelPackage.price : Math.min(existingPrice, travelPackage.price);

          startingPriceByDestination.set(travelPackage.destinationId, nextPrice);
        });

        this.destinations = destinations.map((destination) => ({
          ...destination,
          startingPrice: startingPriceByDestination.get(destination.id),
        }));

        this.countries = Array.from(new Set(destinations.map((destination) => destination.country))).sort();
      });
  }

  viewPackages(destinationId: string): void {
    this.router.navigate(['/packages', destinationId]);
  }

  pickRandomDestination(): void {
    if (!this.visibleDestinations.length) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * this.visibleDestinations.length);
    this.viewPackages(this.visibleDestinations[randomIndex].id);
  }

  handleImageError(event: Event, destinationId: string): void {
    const imageElement = event.target as HTMLImageElement | null;

    if (!imageElement || imageElement.dataset['fallbackApplied'] === 'true') {
      return;
    }

    imageElement.dataset['fallbackApplied'] = 'true';
    imageElement.src = `${this.fallbackBaseUrl}/${destinationId}-destination-fallback/1200/800`;
  }

  get visibleDestinations(): Destination[] {
    const query = this.searchQuery.trim().toLowerCase();

    return this.destinations.filter((destination) => {
      const matchesQuery =
        !query ||
        destination.name.toLowerCase().includes(query) ||
        destination.country.toLowerCase().includes(query) ||
        destination.summary.toLowerCase().includes(query);

      const matchesCountry = this.selectedCountry === 'all' || destination.country === this.selectedCountry;

      const matchesBudget =
        this.maxBudget === null ||
        destination.startingPrice === undefined ||
        destination.startingPrice <= this.maxBudget;

      const matchesRating = destination.rating >= this.minRating;

      return matchesQuery && matchesCountry && matchesBudget && matchesRating;
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCountry = 'all';
    this.maxBudget = null;
    this.minRating = 4;
  }
}
