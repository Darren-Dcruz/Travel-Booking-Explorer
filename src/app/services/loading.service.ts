import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly pendingRequests = new BehaviorSubject(0);

  readonly isLoading$: Observable<boolean> = this.pendingRequests.pipe(
    map((count) => count > 0),
    distinctUntilChanged(),
  );

  begin(): void {
    this.pendingRequests.next(this.pendingRequests.value + 1);
  }

  end(): void {
    this.pendingRequests.next(Math.max(0, this.pendingRequests.value - 1));
  }
}
