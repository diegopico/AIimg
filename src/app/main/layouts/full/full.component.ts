import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { CoreService } from './../../../shared/services/core.service';
import { AppSettings } from 'src/app/config';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { navItems } from './vertical/sidebar/sidebar-data';
import { NavService } from './../../../shared/services/nav.service';
import { AppNavItemComponent } from './vertical/sidebar/nav-item/nav-item.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './vertical/sidebar/sidebar.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { HeaderComponent } from './vertical/header/header.component';
import { AppHorizontalHeaderComponent } from './horizontal/header/header.component';
import { AppHorizontalSidebarComponent } from './horizontal/sidebar/sidebar.component';
import { AppBreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { CustomizerComponent } from './shared/customizer/customizer.component';
import { AuthService } from 'src/app/shared/services/auth.service';
//import { ChatliveComponent } from './../../../shared/controls/chat-live/chat-live.component';
import { SidenavService } from './sidenav.service';
import { BrandingComponent } from './vertical/sidebar/branding.component';
//import { Ajax } from '@syncfusion/ej2-base';

import { ChatbotComponent, ChatMessage } from 'src/app/shared/controls/chatbot/chatbot.component';
import { navItemsiA } from 'src/app/iA/ia.sidebar';
import { NavItem } from './vertical/sidebar/nav-item/nav-item';

const MOBILE_VIEW = 'screen and (max-width: 768px)';
const TABLET_VIEW = 'screen and (min-width: 769px) and (max-width: 1024px)';
const MONITOR_VIEW = 'screen and (min-width: 1024px)';
const BELOWMONITOR = 'screen and (max-width: 1023px)';

// for mobile app sidebar
interface apps {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  link: string;
}

interface quicklinks {
  id: number;
  title: string;
  link: string;
}
  
@Component({
    selector: 'app-full',
    imports: [
        RouterModule,
        AppNavItemComponent,
        MaterialModule,
        CommonModule,
        SidebarComponent,
        NgScrollbarModule,
        TablerIconsModule,
        HeaderComponent,
        AppHorizontalHeaderComponent,
        AppHorizontalSidebarComponent,
        AppBreadcrumbComponent,
        CustomizerComponent,
        //ChatliveComponent,
        //ChatbotComponent,
        //BrandingComponent
    ],
    templateUrl: './full.component.html',
  
    encapsulation: ViewEncapsulation.None
})
export class FullComponent implements OnInit {
  public navItems: Array<NavItem> = [];
  public _navItemsiA = navItemsiA;
  

  @ViewChild('leftsidenav')
  public sidenav: MatSidenav;
  
  @ViewChild('customizerRight') public sidenavconfig: MatSidenav;

  resView = false;
  @ViewChild('content', { static: true }) content!: MatSidenavContent;
  //get options from service
  options = this.settings.getOptions();
  private layoutChangesSubscription = Subscription.EMPTY;
  private isMobileScreen = false;
  private isContentWidthFixed = true;
  private isCollapsedWidthFixed = false;
  private htmlElement!: HTMLHtmlElement;

  public userName: string='';
  public userRole: string='';
  public userEmail: string='';

  get isOver(): boolean {
    return this.isMobileScreen;
  }

  get isTablet(): boolean {
    return this.resView;
  }

  // for mobile app sidebar
  apps: apps[] = [
    {
      id: 1,
      img: './assets/images/svgs/icon-dd-chat.svg',
      title: 'Chat Application',
      subtitle: 'Messages & Emails',
      link: '/apps/chat',
    }
  ];

  quicklinks: quicklinks[] = [
    {
      id: 1,
      title: 'Pricing Page',
      link: '/theme-pages/pricing',
    },
   
  ];

  //'--------------------------ChatBot----------------------------------'
  theme: 'light' | 'dark' = 'light';
  botName: string = 'Monica';
  primaryColor: string = '#7c3aed';
  messages: ChatMessage[] = [];
  chatbotVisible: boolean = true;
  
  // Lista de opciones de colores para el usuario
  colorOptions: {name: string, value: string}[] = [
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
    private mediaMatcher: MediaMatcher,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private navService: NavService, private cdr: ChangeDetectorRef,
    private _authService: AuthService,
    private _router: Router,
    private sidenavService: SidenavService
  ) {
    this.htmlElement = document.querySelector('html')!;
    this.layoutChangesSubscription = this.breakpointObserver
      .observe([MOBILE_VIEW, TABLET_VIEW, MONITOR_VIEW, BELOWMONITOR])
      .subscribe((state) => {
        // SidenavOpened must be reset true when layout changes
        this.options.sidenavOpened = true;
        this.isMobileScreen = state.breakpoints[BELOWMONITOR];
        if (this.options.sidenavCollapsed == false) {
          this.options.sidenavCollapsed = state.breakpoints[TABLET_VIEW];
        }
        this.isContentWidthFixed = state.breakpoints[MONITOR_VIEW];
        this.resView = state.breakpoints[BELOWMONITOR];
      });

    // Initialize project theme with options
    this.receiveOptions(this.options);

    // This is for scroll to top
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((e) => {
        this.content.scrollTo({ top: 0 });
      });

    let token=this._authService.getToken();
    const tokenInfo = this._authService.getTokenInfo(token!);  
    //console.log(tokenInfo);
    if (tokenInfo){
      this.userName=tokenInfo.name;
      this.userRole=tokenInfo.role;
      this.userEmail=tokenInfo.email;
    }
    
    // Inicializa con un mensaje de bienvenida
    this.messages = [
      {
        id: 1,
        text: 'Hello! I\'m Monica, your virtual assistant. How can I help you today?',
        sender: 'bot',
        timestamp: new Date(),
        senderName: this.botName
      }
    ];
    this.navItems = [];
    navItems.forEach((item:any)=>{
      this.navItems.push(item);
    });
    this._navItemsiA.forEach(item=>{
      this.navItems.push(item);
    });
  }

  isFilterNavOpen = false;
  
  toggleFilterNav() {
    this.isFilterNavOpen = !this.isFilterNavOpen;
    console.log('Sidebar open:', this.isFilterNavOpen);
    this.cdr.detectChanges(); // Ensures Angular updates the view
  }

  ngOnInit(): void {
    window.setTimeout(() => {
      this.sidenavService.setSidenav(this.sidenavconfig);
    }, 500);
    this.themeSubscription = this.settings.themeChanges().subscribe(response=>{
      //console.log(response);
      this.currentTheme = response === 'dark' ? 'dark' : 'light';
    });

  }

  ngOnDestroy() {
    this.layoutChangesSubscription.unsubscribe();
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  toggleCollapsed() {
    this.isContentWidthFixed = false;
    this.options.sidenavCollapsed = !this.options.sidenavCollapsed;
    this.resetCollapsedState();
  }

  resetCollapsedState(timer = 400) {
    setTimeout(() => this.settings.setOptions(this.options), timer);
  }

  onSidenavClosedStart() {
    this.isContentWidthFixed = false;
  }

  onSidenavOpenedChange(isOpened: boolean) {
    this.isCollapsedWidthFixed = !this.isOver;
    this.options.sidenavOpened = isOpened;
    this.settings.setOptions(this.options);
  }

  receiveOptions(options: AppSettings): void {
    this.toggleDarkTheme(options);
    this.toggleColorsTheme(options);
    this.settings.setOptions(options);
    this.options=options;
    //console.log(options);
  }

  toggleDarkTheme(options: AppSettings) {
    if (options.theme === 'dark') {
      this.htmlElement.classList.add('dark-theme');
      this.htmlElement.classList.remove('light-theme');
      ////this.onChange4('material-dark');
      //this.onChangeAll('allmaterial-dark');
      ////this.htmlElement.classList.add('dark');
      ////this.htmlElement.classList.remove('light');
    } else {
      this.htmlElement.classList.remove('dark-theme');
      this.htmlElement.classList.add('light-theme');
      ////this.onChange4('material');
      //this.onChangeAll('allmaterial');
      ////this.htmlElement.classList.remove('dark');
      ////this.htmlElement.classList.add('light');
      
    }
  }
  public onChangeAll(e: any): void {
    let themeName = e;
    
    let styleLinkbase: any = document.getElementById('css-all');
    styleLinkbase.href = './assets/styles/'  + themeName + '.css';

  }
  public onChange4(e: any): void {
       let themeName = e;
       //document.getElementsByTagName('body')[0].style.display = 'none';

       let styleLinkbase: any = document.getElementById('css-base');
       styleLinkbase.href = './assets/styles/ej2-angular-base/'  + themeName + '.css';


       let styleLinkgrids: any = document.getElementById('css-grids');
       styleLinkgrids.href = './assets/styles/ej2-angular-grids/'  + themeName + '.css';

       let styleLinknavigations: any = document.getElementById('css-navigations');
       styleLinknavigations.href = './assets/styles/ej2-navigations/'  + themeName + '.css';


       //setTimeout(function () { document.getElementsByTagName('body')[0].style.display = 'block'; }, 250);
  }

  public onChange3(e: any): void {
    //let htmlElement2!: HTMLLinkElement;
    //htmlElement2 = document.getElementById('theme')!;

    let styleTag = document.getElementById('theme') as HTMLLinkElement
    if (styleTag){
      console.log(styleTag);
      styleTag.href='./assets/styles/' + e + '.css'
      styleTag.href='https://cdn.syncfusion.com/ej2/material.css';
    }
    
  }

  /*
  public onChange(e: any): void {
        if (e) {
          let ajax: Ajax = new Ajax('./assets/styles/' + e + '.css', 'GET', true);
          ajax.send().then((result: any) => {
            let styleTag = document.getElementById('theme');
            if (styleTag){
              styleTag.innerHTML= + result;
            }
            var body = document.getElementsByTagName('body');
            e.lastIndexOf('dark') > 0 ? document.getElementsByTagName('body')[0].classList.add('dark') :  document.getElementsByTagName('body')[0].classList.remove('dark');
          });
        }
      }
  */
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




  /* ******************************chatbot************************************* */
  // Maneja los mensajes enviados desde el componente chatbot
  handleSendMessage(message: string): void {
    console.log('Message received:', message);
    
    // Simular una respuesta del bot después de 1 segundo
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: Date.now(),
        text: this.generateBotResponse(message),
        sender: 'bot',
        timestamp: new Date(),
        senderName: this.botName
      };
      
      this.messages = [...this.messages, botResponse];
    }, 1000);
  }

  // Genera una respuesta simulada del bot
  generateBotResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! How can I assist you today?';
    }
    
    if (lowerMessage.includes('help')) {
      return 'I can help you with information, answer questions, or just chat. What would you like to know?';
    }
    
    if (lowerMessage.includes('thanks') || lowerMessage.includes('thank you')) {
      return 'You\'re welcome! Is there anything else I can help you with?';
    }
    
    if (lowerMessage.includes('weather')) {
      return 'I\'m sorry, I don\'t have access to real-time weather data. You might want to check a weather service or app for that information.';
    }
    
    if (lowerMessage.includes('name')) {
      return `My name is ${this.botName}. I'm an AI assistant designed to help you with various tasks and information.`;
    }
    
    // Respuesta genérica
    return `I received your message: "${userMessage}". How can I provide more specific help?`;
  }

  // Cambia el tema entre claro y oscuro
  toggleTheme(): void {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
  }

  // Maneja el evento de añadir habilidad
  handleAddSkill(): void {
    const botResponse: ChatMessage = {
      id: Date.now(),
      text: 'I\'ve added a new skill to help you better. Now I can assist with more complex tasks!',
      sender: 'bot',
      timestamp: new Date(),
      senderName: this.botName
    };
    
    this.messages = [...this.messages, botResponse];
  }

  // Cambia el color primario
  changeColor(color: string): void {
    this.primaryColor = color;
  }

  // Maneja el evento de abrir/cerrar el chat
  handleToggleChat(isOpen: boolean): void {
    console.log('Chat is now', isOpen ? 'open' : 'closed');
  }

  onLogout() {
    this._authService.logoutAndRemoveToken();
    //let token=this._authService.getToken();
    //const tokenInfo = this._authService.getTokenInfo(token!);  
    //console.log(token);
    this._router.navigate(['site/home']);
  }

}
