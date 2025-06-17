import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';

@Component({
    selector: 'app-loading',
    imports: [RouterModule, TablerIconsModule,MaterialModule],
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
   @Input() loading: boolean;
  constructor() {
  }
}
