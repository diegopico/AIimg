import { Route } from '@angular/router';
import { TheAgentComponent } from './theagent/theagent.component';

export const DashboardsRoutes: Route[] = [
  {
    path: 'the-agent',
    component:  TheAgentComponent,
    data: {
      title: 'The Agent Dashboard',
      urls: [
        { title: 'Dashboard', url: '/dashboards/the-agent' },
        { title: 'The Agent' },
      ],
    },
  },
  {
    path: '',
    redirectTo: 'upload-file-prod',// 'the-agent',
    pathMatch: 'full'
  }
] as Route[]; 