import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DestinationListComponent } from './components/destination-list/destination-list';
import { PackageDetailComponent } from './components/package-detail/package-detail';
import { BookingFormComponent } from './components/booking-form/booking-form';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard';

const routes: Routes = [
  { path: '', component: DestinationListComponent },
  { path: 'destinations', component: DestinationListComponent },
  { path: 'packages/:id', component: PackageDetailComponent },
  { path: 'booking/:id', component: BookingFormComponent },
  { path: 'my-bookings', component: UserDashboardComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
