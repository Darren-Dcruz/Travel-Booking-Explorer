import { Pipe, PipeTransform } from '@angular/core';
import { Destination } from '../models/destination.model';

@Pipe({
  name: 'destinationFilter',
  standalone: true,
})
export class DestinationFilterPipe implements PipeTransform {
  transform(
    destinations: Destination[] | null,
    searchQuery: string,
    selectedCountry: string,
    maxBudget: number | null,
    minRating: number,
  ): Destination[] {
    if (!destinations) {
      return [];
    }

    const normalizedQuery = searchQuery.trim().toLowerCase();

    return destinations
      .filter((destination) => {
        const matchesQuery =
          !normalizedQuery ||
          destination.name.toLowerCase().includes(normalizedQuery) ||
          destination.summary.toLowerCase().includes(normalizedQuery);

        const matchesCountry = selectedCountry === 'all' || destination.country === selectedCountry;
        const matchesBudget =
          maxBudget === null || destination.startingPrice === undefined || destination.startingPrice <= maxBudget;
        const matchesRating = destination.rating >= minRating;

        return matchesQuery && matchesCountry && matchesBudget && matchesRating;
      })
      .sort((a, b) => b.reviews - a.reviews);
  }
}
