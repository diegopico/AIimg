import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { DashboardsRoutes } from './dashboards.routes';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardsRoutes),
    HttpClientModule
  ],
  providers: [
  ]
})
export class DashboardsModule {}
