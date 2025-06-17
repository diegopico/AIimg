import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreService } from './../../../../shared/services/core.service';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-home-footer',
  imports: [MaterialModule, TablerIconsModule, TranslateModule, CommonModule,
    TablerIconsModule,
  ],
  templateUrl: './home-footer.component.html',
  styleUrls: ['./home-footer.component.css']
})
export class HomeFooterComponent {

  constructor(
    private settings: CoreService,

  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }




}
