import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpEventType } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UploadFisicalService } from './upload-fisical.service';
import { UploadLogicalService } from './upload-logical.service';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ImagenViewerComponent } from './imagen-viewer';
import { environment } from 'src/environments/environment.development';

export interface UploadedImage {
  id: string;
  fileName: string;
  url: string;
  uploadDate: Date;
}

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    MatSnackBarModule
  ]
})
export class UploadFileComponent implements OnInit, OnChanges {
  @Input() apiLogical: string = '';
  @Input() apiFisical: string = '';
  @Input() entityId: string = '';
  @Input() maxFileSize: number = 5;
  @Input() allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif'];
  @Input() maxFiles: number = 5;
  @Input() productIds: string[] = [];
  @Input() images: UploadedImage[] = [];
  @Output() imageUploaded = new EventEmitter<any>();
  @Output() imageDeleted = new EventEmitter<{imageId: string,id: string, index: number}>();
  
  uploadProgress: number = 0;
  isUploading: boolean = false;
  uploadedImages: UploadedImage[] = [];
  previewUrls: string[] = [];
  selectedFiles: File[] = [];
  private uploadFisical: UploadFisicalService;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private UploadLogical: UploadLogicalService,
    private dialog: MatDialog
  ) {
    // Initialize arrays
    this.uploadedImages = [];
    this.previewUrls = [];
    this.selectedFiles = [];
    this.uploadFisical= new UploadFisicalService(http);
    this.UploadLogical.setPathUrl(this.apiLogical);
    this.uploadFisical.setPathUrl(this.apiFisical);

  }

  ngOnInit(): void {
    // Ya no se carga imágenes por entidadId desde PHP
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entityId'] && this.entityId && (!this.productIds || this.productIds.length === 0)) {
      this.uploadedImages = [];
      this.UploadLogical.setPathUrl(this.apiLogical);
      this.uploadFisical.setPathUrl(this.apiFisical);
      this.loadImagesForEntity(this.entityId);
    }
    if (changes['images']) {
      //console.log('Nuevas imágenes recibidas en upload-file:', this.images);
    }
  }

  loadImagesForEntity(entityId: string): void {
    this.UploadLogical.getImagesLogical(entityId).subscribe({
      next: (response) => {
        this.images = (response.Data || []).map((img: any) => ({
          id: img.Id || img.id,
          fileName: (img.FileName || img.fileName || '').trim(),
          url: (img.Url || img.url || '').replace(/^([.]{2}\/)+/, '').trim(),
          uploadDate: img.UploadDate || img.uploadDate
        }));
        this.imageUploaded.emit(this.images);
      },
      error: (error) => {
        this.snackBar.open('Error al cargar imágenes del producto', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
    this.previewUrls = [];
    
    // Validate files
    const invalidFiles = this.selectedFiles.filter(file => 
      !this.allowedTypes.includes(file.type) || file.size > this.maxFileSize * 1024 * 1024
    );
    
    if (invalidFiles.length > 0) {
      this.snackBar.open(
        `Algunos archivos no son válidos. Por favor asegúrese de que todos los archivos sean imágenes y tengan un tamaño menor a ${this.maxFileSize}MB.`, 
        'Close', 
        { duration: 5000 }
      );
      
      // Filter out invalid files
      this.selectedFiles = this.selectedFiles.filter(file => 
        this.allowedTypes.includes(file.type) && file.size <= this.maxFileSize * 1024 * 1024
      );
    }
    
    // Generate previews for valid files
    this.selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrls.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  uploadFiles(): void {
    if (this.selectedFiles.length === 0) {
      this.snackBar.open('Por favor seleccione archivos para subir.', 'Close', { duration: 3000 });
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    const formData = new FormData();
    this.selectedFiles.forEach(file => {
      formData.append('files[]', file);
    });
    if (this.productIds && this.productIds.length > 0) {
      formData.append('productIds', JSON.stringify(this.productIds));
    } else {
      formData.append('entityId', this.entityId);
    }

    // Subida múltiple
    if (this.productIds && this.productIds.length > 0) {
      this.uploadFisical.uploadImagesFormDataFisical(formData).subscribe({
        next: (phpResponse) => {
          // Determinar si la respuesta es un array o un objeto con data
          let imagesData: any[] = [];
          if (Array.isArray(phpResponse)) {
            imagesData = phpResponse;
          } else if (phpResponse && typeof phpResponse === 'object' && Array.isArray((phpResponse as any).data)) {
            imagesData = (phpResponse as any).data;
          }
          // Por simplicidad, tomamos la primera imagen subida (en modo múltiple solo se permite una)
          const img = imagesData[0];
          const imageData = {
            id: '',//img.id || img.Id,
            fileName: img.fileName || img.FileName,
            url: img.url || img.Url,
            uploadDate: new Date()
          };
          // Llamar al endpoint lógico para asociar la imagen a los productos
          this.UploadLogical.addImageToMultiple(this.productIds, imageData).subscribe({
            next: (apiResponse) => {
              let logicalImages: any[] = [];
              if (Array.isArray(apiResponse.data)) {
                logicalImages = apiResponse.data;
              } else if (apiResponse && Array.isArray((apiResponse as any).Data)) {
                logicalImages = (apiResponse as any).Data;
              }
              // Filtrar para mostrar solo una vez la imagen subida (por fileName o url)
              const uniqueImages = logicalImages.filter(
                (img, index, self) =>
                  index === self.findIndex(i => i.FileName === img.FileName || i.Url === img.Url)
              );
              this.uploadedImages = [...this.uploadedImages, ...uniqueImages.map((img: any) => ({
                id: img.Id,
                fileName: img.FileName,
                url: img.Url,
                uploadDate: img.UploadDate,
                productId: img.ProductId
              }))];
              this.images = [...this.images, ...uniqueImages.map((img: any) => ({
                id: img.Id,
                fileName: img.FileName,
                url: img.Url,
                uploadDate: img.UploadDate
              }))];
              this.isUploading = false;
              this.selectedFiles = [];
              this.previewUrls = [];
              this.imageUploaded.emit(this.images);
              this.snackBar.open('Imagen asociada a múltiples productos correctamente!', 'Close', { duration: 3000 });
            },
            error: (error) => {
              this.isUploading = false;
              this.snackBar.open('Error asociando imagen a múltiples productos.', 'Close', { duration: 5000 });
            }
          });
        },
        error: (error) => {
          this.isUploading = false;
          this.snackBar.open('Error uploading files. Please try again.', 'Close', { duration: 5000 });
        }
      });
    } else {
      // Subida simple (un solo producto)
      this.uploadFisical.uploadImagesFormDataFisical(formData).subscribe({
        next: (phpResponse) => {
          const associateObservables = phpResponse.map((img: any) => {
            return this.UploadLogical.addImageLogical(this.entityId, {
              fileName: img.fileName || img.FileName,
              url: img.url || img.Url,
              uploadDate: new Date()
            });
          });

          // 2. Asociar cada imagen al producto (API lógica)
          forkJoin(associateObservables).subscribe({
            next: (apiResponses) => {
              const mappedImages = apiResponses.map((resp: any) => {
                const img = resp.data || resp.Data || resp; // flexible
                return {
                  id: img.id || img.Id,
                  fileName: img.fileName || img.FileName,
                  url: img.url || img.Url,
                  uploadDate: img.uploadDate || img.UploadDate
                };
              });
              this.uploadedImages = [...this.uploadedImages, ...mappedImages];
              this.images = [...this.images, ...mappedImages];
              this.isUploading = false;
              this.selectedFiles = [];
              this.previewUrls = [];
              this.imageUploaded.emit(this.images);
              this.snackBar.open('Imagen asociada al producto correctamente!', 'Close', { duration: 3000 });
            },
            error: (error) => {
              this.isUploading = false;
              this.snackBar.open('Error al asociar la imagen. Por favor intente nuevamente.', 'Close', { duration: 5000 });
            }
          });
        },
        error: (error) => {
          this.isUploading = false;
          this.snackBar.open('Error al subir el archivo. Por favor intente nuevamente.', 'Close', { duration: 5000 });
        }
      });
    }
  }
  removeImage(index: number): void {
    // For preview images
    if (index < this.previewUrls.length) {
      this.previewUrls.splice(index, 1);
      this.selectedFiles.splice(index, 1);
    }
  }

  deleteUploadedImage(image: UploadedImage, index: number): void {
    if (!image.id) {
      this.snackBar.open('No se puede eliminar: el ID de la imagen es inválido.', 'Cerrar', { duration: 3000 });
      return;
    }
    const realFileName = image.url ? image.url.split('/').pop() : '';
    if (!realFileName) {
      this.snackBar.open('No se puede eliminar: el nombre de archivo es inválido.', 'Cerrar', { duration: 3000 });
      return;
    }

    // 1. Eliminar imagen lógica (API)
    this.UploadLogical.deleteImageLogical(this.entityId, image.id).subscribe({
      next: () => {
        this.uploadedImages = this.uploadedImages.filter(img => img.id !== image.id);
        this.images = this.images.filter(img => img.id !== image.id);
        
        // Emitir evento para notificar al componente padre
        this.imageDeleted.emit({
          imageId: realFileName,
          id: image.id,
          index: index
        });

        // 2. Eliminar imagen física (PHP)
        this.uploadFisical.deleteImageFisical(realFileName).subscribe({
          next: () => {
            this.uploadedImages = this.uploadedImages.filter(img => img.id !== image.id);
            this.images = this.images.filter(img => img.id !== image.id);
            this.imageDeleted.emit({
              imageId: realFileName,
              id: image.id,
              index: index
            });
            this.imageUploaded.emit(this.images);
            this.snackBar.open('Imagen eliminada correctamente', 'Cerrar', { duration: 3000 });
          },
          error: (error) => {
            this.snackBar.open('Error al eliminar la imagen física.', 'Cerrar', { duration: 3000 });
          }
        });
      },
      error: (error) => {
        this.snackBar.open('Error al eliminar la imagen lógica.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  get allImages(): UploadedImage[] {
    if (this.productIds && this.productIds.length > 0) {
      // Modo múltiple: solo mostrar imágenes subidas en esta sesión
      return this.uploadedImages;
    }
    // Modo simple: combinar imágenes del input y subidas en la sesión
    const existingImages = this.images || [];
    const sessionImages = this.uploadedImages || [];
    const imageMap = new Map<string, UploadedImage>();
    existingImages.forEach(img => {
      if (img.id) {
        imageMap.set(img.id, img);
      }
    });
    sessionImages.forEach(img => {
      if (img.id) {
        imageMap.set(img.id, img);
      }
    });
    return Array.from(imageMap.values());
  }
  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = '/assets/images/nofound.png';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.onFileSelected({ target: { files: event.dataTransfer.files } });
    }
  }

  openImageViewer(url: string): void {
    this.dialog.open(ImagenViewerComponent, {
      data: { imageUrl: url },
      panelClass: 'custom-image-viewer-dialog',
      maxWidth: '90vw',
      maxHeight: '90vh',
      autoFocus: false
    });
  }

} 