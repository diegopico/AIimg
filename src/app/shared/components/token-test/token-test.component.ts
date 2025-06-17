import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-token-test',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule
  ],
  styleUrls: ['./token-test.component.scss'],
  template: `
    <mat-card class="token-test-card">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>security</mat-icon>
          Test de Refresh Token
        </mat-card-title>
        <mat-card-subtitle>
          Herramientas para probar el funcionamiento del refresh token
        </mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <div class="token-info">
          <h3>Estado Actual del Token</h3>
          <div class="info-row">
            <strong>¿Autenticado?:</strong> 
            <span [class]="isAuthenticated ? 'status-success' : 'status-error'">
              {{ isAuthenticated ? 'Sí' : 'No' }}
            </span>
          </div>
          <div class="info-row">
            <strong>Token presente:</strong> 
            <span [class]="hasToken ? 'status-success' : 'status-error'">
              {{ hasToken ? 'Sí' : 'No' }}
            </span>
          </div>
          <div class="info-row">
            <strong>Refresh Token presente:</strong> 
            <span [class]="hasRefreshToken ? 'status-success' : 'status-error'">
              {{ hasRefreshToken ? 'Sí' : 'No' }}
            </span>
          </div>
          <div class="info-row" *ngIf="tokenExpiration">
            <strong>Expiración del token:</strong> 
            <span [class]="isTokenExpired ? 'status-error' : 'status-success'">
              {{ tokenExpiration | date:'medium' }}
              {{ isTokenExpired ? ' (EXPIRADO)' : '' }}
            </span>
          </div>
          <div class="info-row">
            <strong>Intervalo de refresh periódico:</strong> 
            <span class="status-info">{{ refreshInterval }} minutos</span>
          </div>
        </div>
      </mat-card-content>
      
      <mat-card-actions>
        <div class="actions-grid">
          <button 
            mat-raised-button 
            color="primary"
            (click)="forceRefreshToken()"
            [disabled]="isLoading || !hasRefreshToken">
            <mat-icon>refresh</mat-icon>
            Forzar Refresh Token
            <mat-progress-spinner 
              *ngIf="isLoading" 
              diameter="20" 
              mode="indeterminate">
            </mat-progress-spinner>
          </button>
          
          <button 
            mat-raised-button 
            color="accent"
            (click)="updateRefreshInterval()">
            <mat-icon>schedule</mat-icon>
            Cambiar Intervalo (5 min)
          </button>
          
          <button 
            mat-raised-button 
            color="warn"
            (click)="stopPeriodicRefresh()">
            <mat-icon>stop</mat-icon>
            Detener Refresh Periódico
          </button>
          
          <button 
            mat-raised-button
            (click)="refreshStatus()">
            <mat-icon>update</mat-icon>
            Actualizar Estado
          </button>
        </div>
      </mat-card-actions>
    </mat-card>
  `
})
export class TokenTestComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  hasToken = false;
  hasRefreshToken = false;
  tokenExpiration: Date | null = null;
  isTokenExpired = false;
  isLoading = false;
  refreshInterval = 15;
  
  private subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.refreshStatus();
    
    // Suscribirse a cambios en el estado de autenticación
    this.subscription.add(
      this.authService.authState.subscribe(state => {
        this.isAuthenticated = state.isAuthenticated;
        this.isLoading = state.isLoading;
        this.hasToken = !!state.accessToken;
        this.hasRefreshToken = !!state.refreshToken;
        
        if (state.accessToken) {
          this.tokenExpiration = this.authService.getTokenExpiration();
          this.isTokenExpired = this.authService.isTokenExpired(state.accessToken);
        } else {
          this.tokenExpiration = null;
          this.isTokenExpired = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  refreshStatus(): void {
    const token = this.authService.getToken();
    this.hasToken = !!token;
    this.hasRefreshToken = !!this.authService.getRefreshToken();
    this.isAuthenticated = this.authService.isAuthenticatedSync();
    this.refreshInterval = this.authService.getPeriodicRefreshInterval();
    
    if (token) {
      this.tokenExpiration = this.authService.getTokenExpiration();
      this.isTokenExpired = this.authService.isTokenExpired(token);
    }
  }

  forceRefreshToken(): void {
    if (!this.hasRefreshToken) {
      this.showMessage('No hay refresh token disponible', 'error');
      return;
    }

    this.showMessage('Iniciando refresh manual del token...', 'info');
    
    this.authService.forceTokenRefresh().subscribe({
      next: (result) => {
        if (result.success) {
          this.showMessage('Token refrescado exitosamente', 'success');
          this.refreshStatus();
        } else {
          this.showMessage('Error al refrescar el token', 'error');
        }
      },
      error: (error) => {
        this.showMessage(`Error: ${error.message}`, 'error');
      }
    });
  }

  updateRefreshInterval(): void {
    this.authService.setPeriodicRefreshInterval(5);
    this.refreshInterval = 5;
    this.showMessage('Intervalo de refresh actualizado a 5 minutos', 'success');
  }

  stopPeriodicRefresh(): void {
    this.authService.stopPeriodicRefresh();
    this.showMessage('Refresh periódico detenido', 'info');
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const config = {
      duration: 3000,
      horizontalPosition: 'center' as const,
      verticalPosition: 'top' as const,
    };

    switch (type) {
      case 'success':
        this.snackBar.open(message, '✓', { ...config, panelClass: ['success-snackbar'] });
        break;
      case 'error':
        this.snackBar.open(message, '✗', { ...config, panelClass: ['error-snackbar'] });
        break;
      default:
        this.snackBar.open(message, '⚡', { ...config, panelClass: ['info-snackbar'] });
    }
  }
} 