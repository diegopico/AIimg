import { Injectable } from '@angular/core';
//import { RightSidenavComponent } from '../right-sidenav/right-sidenav.component';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
	private sidenav: MatSidenav;

	public setSidenav(sidenav: MatSidenav) {
		this.sidenav = sidenav;
	}

	public open() {
		return this.sidenav.open();
	}


	public close() {
		return this.sidenav.close();
	}

	public toggle(): void {
		this.sidenav.toggle();
	}
}