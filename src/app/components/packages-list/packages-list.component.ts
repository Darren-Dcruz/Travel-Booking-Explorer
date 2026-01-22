import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PackageService } from '../../services/package.service';
import { DestinationService } from '../../services/destination.service';
import { Package } from '../../models/package.model';
import { Destination } from '../../models/destination.model';

@Component({
  selector: 'app-packages-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './packages-list.component.html',
  styleUrls: ['./packages-list.component.css']
})
export class PackagesListComponent implements OnInit {
  packages: Package[] = [];
  destination: Destination | undefined;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private packageService: PackageService,
    private destinationService: DestinationService
  ) {}

  ngOnInit(): void {
    const destinationId = this.route.snapshot.paramMap.get('id');
    
    if (destinationId) {
      // Get destination
      this.destinationService.getDestinationById(destinationId).subscribe({
        next: (dest) => {
          this.destination = dest;
        }
      });

      // Get packages for this destination
      this.packageService.getPackagesByDestination(destinationId).subscribe({
        next: (packages) => {
          this.packages = packages;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading packages:', err);
          this.loading = false;
        }
      });
    }
  }

  viewPackageDetail(packageId: string): void {
    this.router.navigate(['/package-detail', packageId]);
  }
}
