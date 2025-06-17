import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconsModule } from 'angular-tabler-icons';
import { IconPlus, IconTrash, IconLayout2, IconArrowBack, IconDeviceFloppy,
         IconBrandGithub, IconX, IconMenu2, IconPalette, IconEye, IconCode, 
         IconSettings, IconSun, IconMoon, IconMinus } from 'angular-tabler-icons/icons';

// Iconos que usaremos de Tabler Icons
const icons = {
  IconPlus,
  IconTrash,
  IconLayout2,
  IconArrowBack,
  IconDeviceFloppy,
  IconBrandGithub,
  IconX,
  IconMenu2,
  IconPalette,
  IconEye,
  IconCode,
  IconSettings,
  IconSun,
  IconMoon,
  IconMinus
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    TablerIconsModule.pick(icons)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 