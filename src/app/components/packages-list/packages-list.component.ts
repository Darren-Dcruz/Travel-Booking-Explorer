import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PackageService } from '../../services/package.service';
import { DestinationService } from '../../services/destination.service';
import { Package } from '../../models/package.model';
import { Destination } from '../../models/destination.model';
import { HighlightOfferDirective } from '../../directives/highlight-offer.directive';
import { getSafeStorage } from '../../utils/storage.util';

type SortOption = 'recommended' | 'priceLowHigh' | 'priceHighLow' | 'durationLowHigh';

@Component({
  selector: 'app-packages-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    HighlightOfferDirective,
  ],
  templateUrl: './packages-list.component.html',
  styleUrls: ['./packages-list.component.css'],
})
export class PackagesListComponent implements OnInit {
  private readonly storage = getSafeStorage();
  private readonly favoritesStorageKey = 'travel-booking-favorite-packages';
  private readonly fallbackBaseUrl = 'https://picsum.photos/seed';

  packages: Package[] = [];
  destination: Destination | undefined;

  selectedCategory = 'all';
  selectedSort: SortOption = 'recommended';
  showFavoritesOnly = false;

  categories: string[] = [];
  expandedDescriptions: Record<string, boolean> = {};
  favoritePackageIds = new Set<string>();

  loading = true;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly packageService: PackageService,
    private readonly destinationService: DestinationService,
  ) {}

  ngOnInit(): void {
    this.loadFavorites();

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
    let result = [...this.packages];

    if (this.selectedCategory !== 'all') {
      result = result.filter((travelPackage) => travelPackage.category === this.selectedCategory);
    }

    if (this.showFavoritesOnly) {
      result = result.filter((travelPackage) => this.favoritePackageIds.has(travelPackage.id));
    }

    switch (this.selectedSort) {
      case 'priceLowHigh':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighLow':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'durationLowHigh':
        result.sort((a, b) => a.duration - b.duration);
        break;
      default:
        result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }

  viewPackageDetail(packageId: string): void {
    this.router.navigate(['/package', packageId, 'overview']);
  }

  surprisePackage(): void {
    if (!this.filteredPackages.length) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * this.filteredPackages.length);
    this.viewPackageDetail(this.filteredPackages[randomIndex].id);
  }

  handleImageError(event: Event, packageId: string): void {
    const imageElement = event.target as HTMLImageElement | null;

    if (!imageElement || imageElement.dataset['fallbackApplied'] === 'true') {
      return;
    }

    imageElement.dataset['fallbackApplied'] = 'true';
    imageElement.src = `${this.fallbackBaseUrl}/${packageId}-package-fallback/1200/800`;
  }

  toggleDescription(packageId: string): void {
    this.expandedDescriptions[packageId] = !this.expandedDescriptions[packageId];
  }

  isDescriptionExpanded(packageId: string): boolean {
    return Boolean(this.expandedDescriptions[packageId]);
  }

  getDescriptionText(travelPackage: Package, maxLength = 210): string {
    if (this.isDescriptionExpanded(travelPackage.id) || travelPackage.description.length <= maxLength) {
      return travelPackage.description;
    }

    return `${travelPackage.description.slice(0, maxLength).trim()}...`;
  }

  toggleFavorite(packageId: string): void {
    if (this.favoritePackageIds.has(packageId)) {
      this.favoritePackageIds.delete(packageId);
    } else {
      this.favoritePackageIds.add(packageId);
    }

    this.saveFavorites();
  }

  isFavorite(packageId: string): boolean {
    return this.favoritePackageIds.has(packageId);
  }

  private loadFavorites(): void {
    const stored = this.storage.getItem(this.favoritesStorageKey);

    if (!stored) {
      return;
    }

    try {
      const ids = JSON.parse(stored) as string[];
      this.favoritePackageIds = new Set(ids);
    } catch {
      this.storage.removeItem(this.favoritesStorageKey);
    }
  }

  private saveFavorites(): void {
    this.storage.setItem(this.favoritesStorageKey, JSON.stringify(Array.from(this.favoritePackageIds)));
  }
}
