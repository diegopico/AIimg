import { Routes } from '@angular/router';
import { BlankComponent } from './main/layouts/blank/blank.component';
import { FullComponent } from './main/layouts/full/full.component';
import { userAuthGuard } from './shared/guards/userAuth.guard';
 
export const routes: Routes = [
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: '',
        redirectTo: '/site/home',
        pathMatch: 'full',
        outlet: 'gohome'
      },
      {
        path: 'site',
        loadChildren: () =>
          import('./main/pages/home/home.routes').then(
            (m) => m.HomeRoutes
          ),
      },
    ],
  },
  {
    path: '',
    component: FullComponent,
    children: [
      
      {
        path: 'dashboards',
        loadChildren: () =>
          import('./iA/forms/dashboards/dashboards.routes').then(
            (m) => m.DashboardsRoutes),
        canActivate: [userAuthGuard],
      },
      {
        path: 'ia',
        loadChildren: () =>
          import('./iA/ia.routes').then((m) => m.IaRoutes),
        canActivate: [userAuthGuard],
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./main/pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          )
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
