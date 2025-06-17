import { Injectable } from '@angular/core';
//import Swal from 'sweetalert2';

    export const  listlanguages: any[] = [
      {
        language: 'English',
        code: 'en',
        type: 'US',
        icon: './assets/images/flag/icon-flag-en.svg',
      },
      {
        language: 'Español',
        code: 'es',
        icon: './assets/images/flag/icon-flag-es.svg',
      },
      {
        language: 'Français',
        code: 'fr',
        icon: './assets/images/flag/icon-flag-fr.svg',
      },
      {
        language: 'German',
        code: 'de',
        icon: './assets/images/flag/icon-flag-de.svg',
      },
      {
        language: 'Chino',
        code: 'zh',
        icon: './assets/images/flag/icon-flag-de.svg',
      },
      {
        language: 'Italiano',
        code: 'it',
        icon: './assets/images/flag/icon-flag-de.svg',
      },
      {
        language: 'Ruso',
        code: 'ru',
        icon: './assets/images/flag/icon-flag-de.svg',
      },
    ];


@Injectable({
    providedIn: 'root'
})
export class LanguageService {

    public languageSelect :any;
    constructor (){
        
    }
    setLanguageDefault(){
        this.languageSelect=listlanguages[2]; //Español
    }
   
    setLanguage(lang:any){
        this.languageSelect=lang;
    }
    getLanguage(){
        return this.languageSelect;
    }
}