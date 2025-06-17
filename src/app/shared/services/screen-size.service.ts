// src/app/services/screen-size.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' // Esto hace que el servicio esté disponible en toda la aplicación
})
export class ScreenSizeService implements OnDestroy {

  // Observable que emitirá true si es móvil y false si es de escritorio
  isMobile$: Observable<boolean>;
  // Puedes añadir un observable para escritorio si lo necesitas
  isDesktop$: Observable<boolean>;

  private readonly MOBILE_BREAKPOINT_QUERY = '(max-width: 767.98px)'; // Para pantallas menores a 768px
  private readonly TABLET_BREAKPOINT_QUERY = '(min-width: 768px) and (max-width: 1023.98px)'; // Para pantallas entre 768px y 1023.98px
  private readonly DESKTOP_BREAKPOINT_QUERY = '(min-width: 1024px)'; // Para pantallas de 1024px o más

  private unsubscribe$ = new Subject<void>(); // Para gestionar la desuscripción de observables

  constructor(private breakpointObserver: BreakpointObserver) {
    // Observa el breakpoint que define un dispositivo móvil
    this.isMobile$ = this.breakpointObserver.observe(this.MOBILE_BREAKPOINT_QUERY)
      .pipe(
        map((state: BreakpointState) => state.matches), // Mapea el estado a un booleano (true si coincide)
        distinctUntilChanged(), // Evita que emita el mismo valor repetidamente
        takeUntil(this.unsubscribe$) // Se desuscribe cuando el servicio se destruye
      );

    // Puedes crear un observable similar para escritorio o tablet
    this.isDesktop$ = this.breakpointObserver.observe(this.DESKTOP_BREAKPOINT_QUERY)
      .pipe(
        map((state: BreakpointState) => state.matches),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      );

    // O si solo necesitas saber si NO es móvil para considerarlo escritorio
    // this.isDesktop$ = this.isMobile$.pipe(map(isMobile => !isMobile));
  }

  // Método que se llama justo antes de que Angular destruya el servicio
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Obtiene el estado actual de si la pantalla es móvil.
   * Útil si necesitas el valor una sola vez (síncrono).
   * Ten en cuenta que este valor puede no estar actualizado inmediatamente en el constructor
   * si la inicialización del BreakpointObserver toma un ciclo.
   */
  get IsMobile(): boolean {
    // Es mejor usar un método para verificar el estado actual si no te suscribes al observable
    // Esto te da el valor "ahora", que es menos reactivo que el observable
    return this.breakpointObserver.isMatched(this.MOBILE_BREAKPOINT_QUERY);
  }

  /**
   * Obtiene el estado actual de si la pantalla es de escritorio.
   */
  get IsDesktop(): boolean {
    return this.breakpointObserver.isMatched(this.DESKTOP_BREAKPOINT_QUERY);
  }

  // Puedes añadir métodos para otras detecciones si tus breakpoints son más complejos
  // isTablet$(): Observable<boolean> {
  //   return this.breakpointObserver.observe(this.TABLET_BREAKPOINT_QUERY).pipe(
  //     map(state => state.matches),
  //     distinctUntilChanged()
  //   );
  // }
}




/*
// src/app/register-demo/register-demo.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ScreenSizeService } from '../services/screen-size.service'; // Importa tu nuevo servicio
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-register-demo',
  templateUrl: './register-demo.component.html',
  styleUrls: ['./register-demo.component.css']
})
export class RegisterDemoComponent implements OnInit, OnDestroy {

  isMobileScreen: boolean = false; // Variable para almacenar el estado del tamaño de pantalla
  isDesktopScreen: boolean = false; // Variable para almacenar el estado del tamaño de pantalla de escritorio

  private unsubscribe$ = new Subject<void>(); // Para gestionar la desuscripción

  constructor(private screenSizeService: ScreenSizeService) { } // Inyecta el servicio

  ngOnInit(): void {
    // Suscríbete al observable para saber cuando cambia el tamaño a móvil
    this.screenSizeService.isMobile$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isMobile => {
        this.isMobileScreen = isMobile;
        console.log('Componente: ¿Es móvil?', this.isMobileScreen);
        // Aquí puedes ejecutar lógica específica para móvil/escritorio
        // Por ejemplo, cambiar el contenido del stepper, etc.
        this.applyLogicBasedOnScreenSize();
      });

    // Suscríbete al observable para saber cuando cambia el tamaño a escritorio (opcional)
    this.screenSizeService.isDesktop$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isDesktop => {
        this.isDesktopScreen = isDesktop;
        console.log('Componente: ¿Es escritorio?', this.isDesktopScreen);
      });

    // También puedes obtener el estado actual de forma síncrona si lo necesitas para una inicialización
    // console.log('Estado inicial móvil:', this.screenSizeService.currentIsMobile);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // Ejemplo de una función que aplica lógica basada en el tamaño de pantalla
  applyLogicBasedOnScreenSize(): void {
    if (this.isMobileScreen) {
      console.log('Aplicando lógica para móvil en el componente...');
      // Por ejemplo, ajustar el número de pasos visibles, etc.
    } else {
      console.log('Aplicando lógica para escritorio en el componente...');
    }
  }

  // Otro método del componente que puede usar la variable
  someOtherAction(): void {
    if (this.isDesktopScreen) {
      alert('Esta acción solo se recomienda en escritorio.');
    } else {
      alert('Para móviles se usa otra acción.');
    }
  }
}
*/