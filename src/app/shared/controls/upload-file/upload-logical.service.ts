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
export class UploadLogicalService {
  #http: HttpClient = inject(HttpClient);
  public apiUrl : string; 

  constructor() {
    
   }
  /*Imagenes Logicas*/
  /*--------------------------------------------------*/
  setPathUrl(apiUrl: string){
    this.apiUrl = apiUrl;
  }
  // Obtener las imágenes 
  getImagesLogical(entityId: string): Observable<IResponse3<UploadedImage[]>> {
    //let api = 'Products';
    //let url = `${environment.basePathUrl}/${api}/${entityId}/images`;
    let url = `${this.apiUrl}/${entityId}/images`;
    return this.#http.get<IResponse<UploadedImage[]>>(url);
  }

  // Asociar una imagen a una entidad
  addImageLogical(entityId: string, imageData: any): Observable<IResponse<UploadedImage>> {
    //let api = 'Products';
    //let url = `${environment.basePathUrl}/${api}/${entityId}/images`;
    let url = `${this.apiUrl}/${entityId}/images`;
    return this.#http.post<IResponse<UploadedImage>>(url, imageData);
  }

  // Eliminar una imagen de una entidad
  deleteImageLogical(entityId: string, imageId: string): Observable<IResponse<any>> {
    //let api = 'Products';
    //let url = `${environment.basePathUrl}/${api}/${entityId}/images/${imageId}`;
    let url = `${this.apiUrl}/${entityId}/images/${imageId}`;
    return this.#http.delete<IResponse<any>>(url);
  }

  // Asociar la misma imagen a múltiples entidades
  addImageToMultiple(productIds: string[], imageData: any): Observable<IResponse<any>> {
    //let api = 'Products';
    //let url = `${environment.basePathUrl}/${api}/bulk-image-upload`;
    let url = `${this.apiUrl}/bulk-image-upload`;
    return this.#http.post<IResponse<any>>(url, {
      productIds,
      imageData
    });
  }
}
