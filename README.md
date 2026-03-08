# Travel Booking and Destination Explorer

Angular + TypeScript single-page application for browsing destinations, viewing package details, and booking trips.

## What Is Implemented

The project now covers all 9 required approaches:

1. Setup and TypeScript fundamentals (interfaces/models already present)
2. Modular component architecture (destination list, package list/detail, booking form, dashboard, navbar)
3. Routing and navigation
   - Route params: `/packages/:id`, `/package/:id`, `/booking/:id`
   - Child routes under package detail: `overview`, `itinerary`, `reviews`
   - Auth guard on `/dashboard`
4. Services and Dependency Injection
   - `DestinationService`, `PackageService`, `BookingService`, `UserService`
   - HTTP data loading + mock booking API flow via interceptor
5. Forms and validation
   - Template-driven registration form (`/register`)
   - Reactive booking form with inline validation + date-range validation
6. Custom pipes and directives
   - `destinationFilter` pipe (country/cost/popularity filters)
   - `appHighlightOffer` directive (top-rated/promotional highlighting)
7. Angular Material UI
   - Material toolbar, cards, table, tabs, dialog, form fields, select, buttons, icons
   - Booking confirmation dialog + expansion panels
8. Observables, HTTP interceptors, and error handling
   - Reactive booking stream via `BehaviorSubject`
   - Global loading interceptor + global error interceptor
   - Snackbar notifications for success/error
9. Integration and testing
   - Service + form + app shell tests
   - Build and tests validated

## Architecture Flow

1. `DestinationListComponent` loads destinations + packages and computes starting prices.
2. User opens destination packages via `/packages/:destinationId`.
3. User opens package detail via `/package/:packageId/overview` and navigates child tabs.
4. User books via `/booking/:packageId`.
5. Booking is submitted through `BookingService` to `/mock-api/bookings` handled by `mockApiInterceptor`.
6. `UserDashboardComponent` consumes booking observable updates in real time.

## Tech Stack

- Angular 21 (standalone components)
- TypeScript
- RxJS
- Angular Material
- Vitest (via Angular test builder)

## Run Locally

```bash
npm install
npm run start
```

Open: `http://localhost:4200`

## Build and Test

```bash
npm run build
npm run test -- --watch=false
```

## Notes

- A lightweight local storage fallback is used for environments where `localStorage` is unavailable.
- Booking API is mocked through an HTTP interceptor so no external backend is required.
