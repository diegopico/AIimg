import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  OnChanges,
} from '@angular/core';
import { navItems } from '../../vertical/sidebar/sidebar-data';
import { navItemsiA } from '../../../../../iA/ia.sidebar';
import { Router } from '@angular/router';
import { NavService } from '../../../../../shared/services/nav.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppHorizontalNavItemComponent } from './nav-item/nav-item.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-horizontal-sidebar',
    imports: [AppHorizontalNavItemComponent, CommonModule],
    templateUrl: './sidebar.component.html'
})
export class AppHorizontalSidebarComponent implements OnInit {
  navItems = navItems;
  navItemsiA = navItemsiA;
  
  parentActive = '';

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    public navService: NavService,
    public router: Router,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 1100px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.router.events.subscribe(
      () => (this.parentActive = this.router.url.split('/')[1])
    );
    
  }

  ngOnInit(): void { }
}
