import { Routes } from '@angular/router';
import { DestinationListComponent } from './components/destination-list/destination-list';
import { PackagesListComponent } from './components/packages-list/packages-list.component';
import { PackageDetailComponent } from './components/package-detail/package-detail';
import { BookingFormComponent } from './components/booking-form/booking-form';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: '/destinations', pathMatch: 'full' },
  { path: 'destinations', component: DestinationListComponent },
  { path: 'packages/:id', component: PackagesListComponent },
  { path: 'package-detail/:id', component: PackageDetailComponent },
  { path: 'booking/:id', component: BookingFormComponent },
  { path: 'my-bookings', component: UserDashboardComponent }
];
