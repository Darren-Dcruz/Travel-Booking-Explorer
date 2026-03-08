import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PackageService } from '../../services/package.service';
import { PackageReview } from '../../models/review.model';

@Component({
  selector: 'app-package-reviews',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './package-reviews.component.html',
  styleUrls: ['./package-reviews.component.css'],
})
export class PackageReviewsComponent implements OnInit {
  reviews: PackageReview[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly packageService: PackageService,
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap
      .pipe(
        switchMap((params) => {
          const packageId = params.get('id');
          return packageId ? this.packageService.getPackageReviews(packageId) : of([]);
        }),
      )
      .subscribe((reviews) => {
        this.reviews = reviews;
      });
  }

  getStars(rating: number): number[] {
    return Array.from({ length: rating }, (_, index) => index);
  }
}
