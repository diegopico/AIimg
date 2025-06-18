import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UploadFileComponent, UploadedImage } from '../../../shared/controls/upload-file/upload-file.component';
//import { UploadFileService } from '../../../shared/controls/upload-file/upload-file.service';
import { ProductService, Product } from '../../services/product.service';

import { TablerIconsModule } from 'angular-tabler-icons';
import { finalize, forkJoin, of, tap } from 'rxjs';
import { WaitService } from 'src/app/shared/controls/wait/wait.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-upload-file-prod',
  templateUrl: './upload-file-prod.component.html',
  styleUrls: ['./upload-file-prod.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatTabsModule,
    MatListModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatChipsModule,
    MatBadgeModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    UploadFileComponent,
    MatIconModule,
    TablerIconsModule,
    TranslateModule
  ]
})
export class UploadFileProdComponent implements OnInit {
  productForm: FormGroup;
  allProducts: Product[] = [];
  products: Product[] = []; // productos filtrados/paginados
  selectedProduct: Product | null = null;
  selectedTabIndex = 0;
  loadingImages = false;
  
  // Variables para selección múltiple
  selectedProducts: Product[] = [];
  selectMode = false;
  allSelected = false;
  
  // Variables para búsqueda
  searchTerm: string = '';
  
  // Variables para paginación
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50, 100];
  currentPage = 0;
  totalProducts = 0;
  isLoading = false;
  

  apiLogical = `${environment.basePathUrl}/Products`;
  apiFisical = `${environment.apiUrlPHP}`;

  constructor(
    private snackBar: MatSnackBar,
    private productService: ProductService,
  ) {
    
  }

  ngOnInit(): void {
    
    this.loadProducts();
  }
  
  // Cargar productos desde la API
  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts(this.pageSize, this.currentPage + 1, this.searchTerm)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.products = response.Result;
            this.totalProducts = response.TotalRows;
          } else {
            this.snackBar.open('No se encontraron productos', 'Cerrar', { duration: 3000 });
            this.products = [];
            this.totalProducts = 0;
          }
        },
        error: (error) => {
          console.error('Error al cargar productos:', error);
          this.snackBar.open('Error al cargar productos', 'Cerrar', { duration: 3000 });
          this.products = [];
          this.totalProducts = 0;
        }
      });
  }
  

  selectProduct(product: Product): void {
    this.selectedProduct = product;
    //console.log(this.apiFisical,this.apiLogical);
    // Ya no se carga ni mapea imágenes aquí, el hijo se encarga
  }


  // Métodos para búsqueda y paginación
  
  search(): void {
    this.currentPage = 0; // Resetear a la primera página al buscar
    this.loadProducts();
  }
  
  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 0;
    this.loadProducts();
  }
  
  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadProducts();
  }
  
  // Métodos para selección múltiple
  
  toggleSelectMode(): void {
    this.selectMode = !this.selectMode;
    if (!this.selectMode) {
      // Al salir del modo selección, desmarcamos todos los productos
      this.clearAllSelections();
      this.selectedTabIndex = 0; // Volver al primer tab
    } else {
      // Al entrar en modo selección, vamos a la pestaña de carga múltiple
      this.selectedTabIndex = 1; // Ir al segundo tab
    }
  }
  
  toggleProductSelection(product: Product): void {
    product.selected = !product.selected;
    this.updateSelectedProducts();
  }
  
  updateSelectedProducts(): void {
    this.selectedProducts = this.products.filter(p => p.selected);
    
    // Verificar si todos están seleccionados
    this.allSelected = this.selectedProducts.length === this.products.length && this.products.length > 0;
    
    // Si hay productos seleccionados, cambiamos a la pestaña de carga múltiple
    if (this.selectedProducts.length > 0) {
      this.selectedTabIndex = 2;
    }
    //console.log(this.allProducts);
  }
  
  toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    
    // Seleccionar o deseleccionar todos los productos visibles
    this.products.forEach(product => {
      product.selected = this.allSelected;
    });
    
    this.updateSelectedProducts();
  }
  
  toggleSelectAllProducts(): void {
    this.allSelected = !this.allSelected;
    
    // Seleccionar o deseleccionar todos los productos (incluso los no visibles)
    this.products.forEach(product => {
      product.selected = this.allSelected;
    });
    
    this.updateSelectedProducts();
  }
  
  clearAllSelections(): void {
    this.products.forEach(product => {
      product.selected = false;
    });
    this.selectedProducts = [];
    this.allSelected = false;
  }
  
  removeProductSelection(product: Product): void {
    product.selected = false;
    this.updateSelectedProducts();
  }
  
  
  // Helper to mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  convertToTitleCase(text: string | null | undefined): string {
    if (!text) {
      return '';
    }
    return text.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
    });
  }
  get selectedProductCodes(): string[] {
    return this.selectedProducts.map(p => p.Code);
  }
  onImageUploaded(event: any): void {
    if (Array.isArray(event)) {
      this.selectedProduct!.images = event;
    }
  }

} 