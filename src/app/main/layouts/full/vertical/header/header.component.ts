import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { CoreService } from '../../../../../shared/services/core.service';
import { MatDialog } from '@angular/material/dialog';
import { navItems } from '../sidebar/sidebar-data';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AppSettings } from 'src/app/config';
import { AuthService } from 'src/app/shared/services/auth.service';
import { isThisISOWeek } from 'date-fns';
//import { CustomizerComponent } from '../../shared/customizer/customizer.component';
import { SidenavService } from '../../sidenav.service';
import { iAglobalService } from 'src/app/iA/services/iAglobal.service';


interface notifications {
  id: number;
  img: string;
  title: string;
  subtitle: string;
}

interface profiledd {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  link: string;
}

@Component({
    selector: 'app-header',
    imports: [
        RouterModule,
        CommonModule,
        NgScrollbarModule,
        TablerIconsModule,
        MaterialModule,
        TranslateModule,
        //CustomizerComponent
    ],
    templateUrl: './header.component.html',
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  showFiller = false;

  options = this.settings.getOptions();
  public selectedLanguage: any = {};
  public languages: any[] = [];

  @Output() optionsChange = new EventEmitter<AppSettings>();

  public userName: string='';
  public userRole: string='';
  public userEmail: string='';
  public userId: string='';

  notifications: notifications[] = [
    {
      id: 1,
      img: './assets/images/profile/user-1.jpg',
      title: 'Roman Joined thes Team!',
      subtitle: 'Congratulate him',
    },
    {
      id: 2,
      img: './assets/images/profile/user-2.jpg',
      title: 'New message received',
      subtitle: 'Salma sent you new message',
    },
  ];

  profiledd: profiledd[] = [
    {
      id: 1,
      //img: './assets/images/svgs/icon-account.svg',
      img: 'user-square-rounded',
      title: 'Mi Perfil',
      subtitle: 'Configuración',
      link: 'ia/users/edituser',
    },
    {
      id: 2,
      //img: './assets/images/svgs/icon-account.svg',
      img: 'key',
      title: 'Cambiar contraseña',
      subtitle: 'Configuración',
      link: 'ia/change-password',
    },
  ];
  toggleActive:boolean = false;
  #iAglobalService = inject(iAglobalService);
  
  constructor(
    private settings: CoreService,
    //private vsidenav: CoreService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private _authService: AuthService,
    private _router: Router,
    private sidenav: SidenavService
  ) {
    

    let token=this._authService.getToken();
    const tokenInfo = this._authService.getTokenInfo(token!);  
    console.log(tokenInfo);
    if (tokenInfo){
      this.userId=tokenInfo.sub;
      this.userName=tokenInfo.name;
      this.userRole=tokenInfo.role;
      this.userEmail=tokenInfo.email;
    }
    this.languages=settings.getLanguagesList();
    this.selectedLanguage = settings.getLanguageSelect();
    this.translate.use(this.selectedLanguage.code);
    translate.setDefaultLang(this.selectedLanguage.code);
    this.translateJsonPerfilUser();
    this.receiveOptions(this.options);


    
    

  }
  onLink(e:any){
    console.log(e);
    console.log(this.userId);
    this.#iAglobalService.setProceso({
      Origen : 'USU',
      Ref    : this.userId,
      Accion : 'Edit',
      data   : ''
    });
    window.setTimeout(() => {
      this._router.navigate([e.link]);//'ia/users/edituser'
    }, 100);
    
  }
  toggleRightSidenav() {
		this.toggleActive = !this.toggleActive;
		this.sidenav.toggle();

    console.log('Clicked');
	}

  receiveOptions(options: AppSettings): void {
    //this.toggleDarkTheme(options);
    //this.toggleColorsTheme(options);
  }
  translateJsonPerfilUser(){
    this.translate.get('perfil.usuario').subscribe((textTranslate:any)=> {
      this.profiledd[0].title=textTranslate;
     });
     this.translate.get('configuracion').subscribe((textTranslate:any)=> {
      this.profiledd[0].subtitle=textTranslate;
     });
  }

  openDialog() {
    const dialogRef = this.dialog.open(AppSearchDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  private emitOptions() {
    console.log(this.options);
    this.optionsChange.emit(this.options);
  }

  setlightDark(theme: string) {
    this.options.theme = theme;
    this.emitOptions();
  }

  changeLanguage(lang: any): void {
    this.translate.use(lang.code);
    this.selectedLanguage = lang;
    this.options.language = lang.code;
    this.settings.setLanguage(lang.code);
    this.emitOptions();
    this.translateJsonPerfilUser();
  }

  onLogout() {
    this._authService.logoutAndRemoveToken();
    this._router.navigate(['site/home']);
  }

  
}

@Component({
    selector: 'search-dialog',
    imports: [RouterModule, MaterialModule, TablerIconsModule, FormsModule],
    templateUrl: 'search-dialog.component.html'
})
export class AppSearchDialogComponent {
  searchText: string = '';
  navItems = navItems;
  navItemsData = navItems.filter((navitem) => navitem.displayName);
}
