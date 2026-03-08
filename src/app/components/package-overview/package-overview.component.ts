import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { PackageService } from '../../services/package.service';
import { Package } from '../../models/package.model';

@Component({
  selector: 'app-package-overview',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatExpansionModule],
  templateUrl: './package-overview.component.html',
  styleUrls: ['./package-overview.component.css'],
})
export class PackageOverviewComponent implements OnInit {
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
