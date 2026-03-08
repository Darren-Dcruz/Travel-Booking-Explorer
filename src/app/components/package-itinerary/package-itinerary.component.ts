import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { PackageService } from '../../services/package.service';
import { Package } from '../../models/package.model';

@Component({
  selector: 'app-package-itinerary',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatCardModule],
  templateUrl: './package-itinerary.component.html',
  styleUrls: ['./package-itinerary.component.css'],
})
export class PackageItineraryComponent implements OnInit {
  packageData: Package | undefined;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly packageService: PackageService,
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap
      .pipe(
        switchMap((params) => {
          const packageId = params.get('id');
          return packageId ? this.packageService.getPackageById(packageId) : of(undefined);
        }),
      )
      .subscribe((travelPackage) => {
        this.packageData = travelPackage;
      });
  }
}
