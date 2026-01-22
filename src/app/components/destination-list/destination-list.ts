import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DestinationService } from '../../services/destination.service';
import { Destination } from '../../models/destination.model';

@Component({
  selector: 'app-destination-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './destination-list.html',
  styleUrls: ['./destination-list.css']
})
export class DestinationListComponent implements OnInit {
  destinations: Destination[] = [];
  searchQuery = '';

  constructor(
    private destinationService: DestinationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.destinationService.getDestinations().subscribe(data => {
      this.destinations = data;
    });
  }

  viewPackages(destinationId: string): void {
  this.router.navigate(['/packages', destinationId]);
}


  get filteredDestinations(): Destination[] {
    if (!this.searchQuery) {
      return this.destinations;
    }
    return this.destinations.filter(dest =>
      dest.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
