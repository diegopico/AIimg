import { Component, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarUiComponent } from '../../../../shared/controls/sidebar-ui/sidebar-ui.component';
import { MenuItem } from '../../../../shared/controls/sidebar-ui/menu.model';
import { navItemsiA } from '../../../../iA/ia.sidebar';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, SidebarUiComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarAppComponent {
  @ViewChild('sidebar') sidebarComponent!: SidebarUiComponent;
  
  isCollapsed = false;
  selectedItem: MenuItem | null = null;
  isMobile = false;

  menuItems: MenuItem[] = navItemsiA.map(item => ({
    id: item.displayName || '',
    title: item.displayName || '',
    icon: item.iconName,
    iconColor: item.iconColor,
    path: item.route,
    type: item.children ? 'collapse' : 'item',
    disabled: item.disabled,
    chipContent: item.chipContent,
    chipClass: item.chipClass,
    external: item.external,
    children: item.children?.map(child => ({
      id: child.displayName || '',
      title: child.displayName || '',
      icon: child.iconName,
      iconColor: child.iconColor,
      path: child.route,
      type: 'item',
      disabled: child.disabled,
      chipContent: child.chipContent,
      chipClass: child.chipClass,
      external: child.external
    }))
  }));

  constructor() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    // En móvil, siempre empezamos con el sidebar cerrado
    if (this.isMobile) {
      this.isCollapsed = true;
    }
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  onItemSelected(item: MenuItem): void {
    this.selectedItem = item;
    if (item.external) {
      window.open(item.path, '_blank');
    }
  }

  onOverlayClick(): void {
    // Asegurarse de que todos los popups y estados se limpien
    if (this.sidebarComponent) {
      this.sidebarComponent.hoveredItem = null;
      this.sidebarComponent.submenuHovered = false;
      this.sidebarComponent.expandedItems.clear();
      if (this.sidebarComponent.closeTimer) {
        clearTimeout(this.sidebarComponent.closeTimer);
        this.sidebarComponent.closeTimer = null;
      }
    }
    this.toggleSidebar();
  }
} 