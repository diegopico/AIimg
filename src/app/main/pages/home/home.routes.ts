import { Routes } from '@angular/router';
import { HomepageComponent } from './home-page/home-page.component';
import { HomeContentComponent } from './home-content/home-content.component';
import { AppSideLoginComponent } from '../authentication/side-login/side-login.component';


export const HomeRoutes: Routes = [
  {
    path: 'home',
    component: HomepageComponent,
    
    children: [
     {
        path: '',
        redirectTo: 'login',// 'start',
        pathMatch: 'full',
        outlet: 'go'
     },
     {
        path: 'start',
        component: HomeContentComponent,
        outlet: 'go'
      },
      {
        path: 'login',
        component: AppSideLoginComponent,
        outlet: 'go'
      },
    ]
  },
  

];
