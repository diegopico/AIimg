import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppSettings, defaults } from '../../config';

export interface lang {
  id:number;
  language?: string;
  code?: string;
  type?: string;
  icon?: string;
}

export const languages: lang[] = [
    {
      id:1,
      language: 'English',
      code: 'en',
      type: 'US',
      icon: './assets/images/flag/United-States.png',
    },
    {
      id:2,
      language: 'Español',
      code: 'es',
      icon: './assets/images/flag/Spain.png',
    },
    {
      id:3,
      language: 'Français',
      code: 'fr',
      icon: './assets/images/flag/France.png',
    },
    {
      id:4,
      language: 'German',
      code: 'de',
      icon: './assets/images/flag/Germany.png',
    },
    {
      id:5,
      language: 'Chino',
      code: 'zh',
      icon: './assets/images/flag/China.png',
    },
    {
      id:6,
      language: 'Italiano',
      code: 'it',
      icon: './assets/images/flag/Italy.png',
    },
    {
      id:7,
      language: 'Ruso',
      code: 'ru',
      icon: './assets/images/flag/Russia.png',
    },
  ];

@Injectable({
  providedIn: 'root',
})

export class CoreService {
  private optionsSignal = signal<AppSettings>(defaults);
  private themeSubject = new BehaviorSubject<string>(defaults.theme);
  public languageSelect :lang;
  public languages=languages;
  
  getOptions() {
    return this.optionsSignal();
  }

  setOptions(options: Partial<AppSettings>) {
    this.optionsSignal.update((current) => ({
      ...current,
      ...options,
    }));
    
    // If theme is updated, emit the new value
    if (options.theme) {
      this.themeSubject.next(options.theme);
    }
  }

  setLanguage(lang: string) {
    this.setOptions({ language: lang });
  }

  getLanguage() {
    return this.getOptions().language;
  }

  getLanguageSelect() {
    let itemLang:any=null;
    this.languages.forEach((item:any)=>{
      if (item.code==this.getLanguage()){
        itemLang=item;
      }
    })
    return itemLang;
  }

  getLanguagesList() {
    return this.languages;
  }

  // Method to get the current theme
  getTheme(): string {
    return this.getOptions().theme;
  }
  
  // Method to observe theme changes
  themeChanges(): Observable<string> {
    //console.log(this.getOptions());
    return this.themeSubject.asObservable();
  }
}



