import { Component } from '@angular/core';
import { CoreService } from '../../../../../shared/services/core.service';

@Component({
  selector: 'app-branding',
  imports: [],
  template: `
    <a href="/" class="logodark">
      <img
        src="./assets/images/logos/dark-logo.png"
        class="align-middle m-2"
        alt="logo"
      />
    </a>

    <a href="/" class="logolight">
      <img
        src="./assets/images/logos/light-logo.png"
        class="align-middle m-2"
        alt="logo"
      />
    </a>
  `,
})
export class BrandingComponent {
  options = this.settings.getOptions();
  constructor(private settings: CoreService) {}
}
