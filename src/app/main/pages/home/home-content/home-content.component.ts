import { Component, Output, EventEmitter, Input, OnInit, OnDestroy, AfterViewInit, Renderer2, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreService } from './../../../../shared/services/core.service';
import { ViewportScroller } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'src/app/config';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';



@Component({
  selector: 'app-home-content',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    TranslateModule,
    MaterialModule,
    TablerIconsModule,
  ],
  templateUrl: './home-content.component.html'
})
export class HomeContentComponent implements OnInit, AfterViewInit, OnDestroy {


  public currentTheme: 'light' | 'dark' = 'dark';
  private themeSubscription: Subscription;
  private htmlElement!: HTMLHtmlElement;
  private renderer = inject(Renderer2);


  constructor(
    private settings: CoreService,
    private scroller: ViewportScroller,
    private translate: TranslateService,
    private coreService: CoreService

  ) {
  }

  ngOnInit(): void {
    this.themeSubscription = this.settings.themeChanges().subscribe(response => {
      console.log(response);
      this.currentTheme = response === 'dark' ? 'dark' : 'light';
    });
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }


  toggleDarkTheme(options: AppSettings) {
    if (options.theme === 'dark') {
      this.htmlElement.classList.add('dark-theme');
      this.htmlElement.classList.remove('light-theme');
    } else {
      this.htmlElement.classList.remove('dark-theme');
      this.htmlElement.classList.add('light-theme');
    }
  }


  toggleColorsTheme(options: AppSettings) {
    // Remove any existing theme class dynamically
    this.htmlElement.classList.forEach((className) => {
      if (className.endsWith('_theme')) {
        this.htmlElement.classList.remove(className);
      }
    });

    // Add the selected theme class
    this.htmlElement.classList.add(options.activeTheme);
  }


}
