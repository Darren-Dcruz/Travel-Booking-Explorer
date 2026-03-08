import { Routes } from '@angular/router';
import { DestinationListComponent } from './components/destination-list/destination-list';
import { PackagesListComponent } from './components/packages-list/packages-list.component';
import { PackageDetailComponent } from './components/package-detail/package-detail';
import { PackageOverviewComponent } from './components/package-overview/package-overview.component';
import { PackageItineraryComponent } from './components/package-itinerary/package-itinerary.component';
import { PackageReviewsComponent } from './components/package-reviews/package-reviews.component';
import { BookingFormComponent } from './components/booking-form/booking-form';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/destinations', pathMatch: 'full' },
  { path: 'destinations', component: DestinationListComponent },
  { path: 'packages/:id', component: PackagesListComponent },
  {
    path: 'package/:id',
    component: PackageDetailComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      { path: 'overview', component: PackageOverviewComponent },
      { path: 'itinerary', component: PackageItineraryComponent },
      { path: 'reviews', component: PackageReviewsComponent },
    ],
  },
  { path: 'booking/:id', component: BookingFormComponent },
  { path: 'register', component: UserRegistrationComponent },
  { path: 'dashboard', component: UserDashboardComponent, canActivate: [authGuard] },
  { path: 'my-bookings', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/destinations' },
];
