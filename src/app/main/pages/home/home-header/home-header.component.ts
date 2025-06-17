import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreService } from './../../../../shared/services/core.service';
import { ViewportScroller } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { RouterLink } from '@angular/router';
import { BrandingComponent } from './../../../../main/layouts/full/vertical/sidebar/branding.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'src/app/config';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-home-header',
  imports: [MaterialModule, TablerIconsModule, RouterLink, BrandingComponent, TranslateModule, CommonModule,
    TablerIconsModule,
    
  ],
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.css']
})
export class HomeHeaderComponent {
  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  options = this.settings.getOptions();
  public selectedLanguage: any = {};
  public languages: any[] = [];
  @Output() optionsChange = new EventEmitter<AppSettings>();
  private htmlElement!: HTMLHtmlElement;


  // Lista de opciones de colores para el usuario
  colorOptions: { name: string, value: string }[] = [
    { name: 'Violet', value: '#7c3aed' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Pink', value: '#ec4899' }
  ];

  public currentTheme: 'light' | 'dark' = 'dark';
  private themeSubscription: Subscription;

  constructor(
    private settings: CoreService,
    private scroller: ViewportScroller,
    private translate: TranslateService,
    private coreService: CoreService

  ) {
    this.languages = settings.getLanguagesList();
    this.selectedLanguage = settings.getLanguageSelect();
    this.translate.use(this.selectedLanguage.code);
    this.htmlElement = document.querySelector('html')!;
    // Initialize project theme with options
    this.receiveOptions(this.options);
  }

  ngOnInit(): void {
    this.themeSubscription = this.settings.themeChanges().subscribe(response => {
      console.log(response);
      this.currentTheme = response === 'dark' ? 'dark' : 'light';
    });
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }


  private emitOptions() {
    this.optionsChange.emit(this.options);
    this.receiveOptions(this.options);
  }

  setlightDark(theme: string) {
    this.options.theme = theme;
    this.settings.setOptions(this.options);
    this.emitOptions();

  }

  changeLanguage(lang: any): void {
    this.translate.use(lang.code);
    this.selectedLanguage = lang;
    this.options.language = lang.code;
    this.settings.setLanguage(lang.code)
    this.emitOptions();
  }

  receiveOptions(options: AppSettings): void {
    this.toggleDarkTheme(options);
    this.toggleColorsTheme(options);
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
