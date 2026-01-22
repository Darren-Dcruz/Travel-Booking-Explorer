import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PackageService } from '../../services/package.service';
import { DestinationService } from '../../services/destination.service';
import { Package } from '../../models/package.model';
import { Destination } from '../../models/destination.model';

@Component({
  selector: 'app-package-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './package-detail.html',
  styleUrls: ['./package-detail.css']
})
export class PackageDetailComponent implements OnInit {
  package: Package | undefined;
  destination: Destination | undefined;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private packageService: PackageService,
    private destinationService: DestinationService
  ) {}

  ngOnInit(): void {
    const packageId = this.route.snapshot.paramMap.get('id');
    
    if (packageId) {
      this.packageService.getPackageById(packageId).subscribe({
        next: (pkg) => {
          if (pkg) {
            this.package = pkg;
            
            // Now fetch the destination
            if (pkg.destinationId) {
              this.destinationService.getDestinationById(pkg.destinationId).subscribe({
                next: (dest) => {
                  this.destination = dest;
                  this.loading = false;
                },
                error: (err) => {
                  console.error('Error loading destination:', err);
                  this.error = 'Failed to load destination details';
                  this.loading = false;
                }
              });
            }
          } else {
            this.error = 'Package not found';
            this.loading = false;
          }
        },
        error: (err) => {
          console.error('Error loading package:', err);
          this.error = 'Failed to load package details';
          this.loading = false;
        }
      });
    } else {
      this.error = 'No package ID provided';
      this.loading = false;
    }
  }

  bookNow(): void {
    if (this.package) {
      this.router.navigate(['/booking', this.package.id]);
    }
  }
}
