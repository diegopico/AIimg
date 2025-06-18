import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UploadedImage } from './upload-file.component';
//import { environment } from '../../../../environments/environment.development';
import { environment } from 'src/environments/environment.prod';
import { IResponse, IResponse3 } from 'src/app/shared/wrappers/response';


@Injectable({
  providedIn: 'root'
})
export class UploadFisicalService {
  private apiUrl :string;// = environment.apiUrlPHP; //'http://localhost:81/assets/php'; // Ajusta el puerto según tu configuración
  #http: HttpClient = inject(HttpClient);
  
  constructor(private http: HttpClient) { }

  // Subir imágenes al servidor
  setPathUrl(apiUrl: string){
    this.apiUrl = apiUrl;
  }

  uploadImagesFisical(files: File[], entityId: string): Observable<UploadedImage[]> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files[]', file);
    });
    formData.append('entityId', entityId);

    return this.http.post<UploadedImage[]>(`${this.apiUrl}/upload.php`, formData);
  }

  // Obtener imágenes de una entidad
  getImagesForEntityFisical(entityId: string): Observable<UploadedImage[]> {
    return this.http.get<UploadedImage[]>(`${this.apiUrl}/get_images.php?entityId=${entityId}`);
  }

  // Eliminar una imagen
  deleteImageFisical(fileName: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/delete_image.php?fileName=${encodeURIComponent(fileName)}`);
  }

  // Subir imágenes usando un FormData ya armado (para soportar productIds)
  uploadImagesFormDataFisical(formData: FormData): Observable<UploadedImage[]> {
    return this.http.post<UploadedImage[]>(`${this.apiUrl}/upload.php`, formData);
  }

  // Obtener todas las imágenes subidas (no por entidad, sino todos los archivos físicos)
  getImagesFisical(): Observable<UploadedImage[]> {
    return this.http.get<UploadedImage[]>(`${this.apiUrl}/get_images.php`);
  }

}
