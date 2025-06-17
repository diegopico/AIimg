import { Injectable, signal } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavService {
  showClass: any = false;

  public currentUrl = signal<string | undefined>(undefined);

  // Subject para colapsar todos los menús
  private collapseAllMenusSubject = new Subject<void>();
  collapseAllMenus$ = this.collapseAllMenusSubject.asObservable();

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.set(event.urlAfterRedirects);
      }
    });
  }

  emitCollapseAllMenus() {
    this.collapseAllMenusSubject.next();
  }
}
