import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoResizeDirective } from './directives/auto-resize.directive';

@NgModule({
  declarations: [
    AutoResizeDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AutoResizeDirective
  ]
})
export class SharedModule { }
