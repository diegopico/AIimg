import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-dashboard-theagent',
  standalone: true,
  imports: [
    CommonModule,
    // Módulos específicos de Material
    TablerIconsModule,
  ],
  templateUrl: './theagent.component.html',
  styleUrls: ['./theagent.component.scss']
})
export class TheAgentComponent implements OnInit {
  // Datos del dashboard principal
  loadingDashboard: boolean = true;
  error: string | null = null;
  
  private subscriptions: Subscription[] = [];
  
  constructor() {}
  
  ngOnInit(): void {
  }
  
}
