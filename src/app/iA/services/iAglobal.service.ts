import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

export declare type ModoProceso = 'New' | 'Edit' | 'Delete' | 'Other';

export interface proceso {
  Origen?    : string;
  Ref?       : string;
  Accion?    : ModoProceso;
  data?      : any;
} 

@Injectable({
  providedIn: 'root'
})
export class iAglobalService {
  //public Proceso:proceso;
  constructor(){
  }
  setProceso(Proceso:proceso){
    localStorage.setItem('Proceso', JSON.stringify(Proceso));
  }
  getProceso():proceso{
    let json:any;
    if (localStorage.getItem("Proceso")){
      json=JSON.parse(localStorage.getItem("Proceso")!) as proceso;
      return json;
    }
    return json;
  }
  clearProceso(){
    localStorage.setItem('Proceso', '');
  }

  setProcesoAux(Proceso:proceso){
    localStorage.setItem('ProcesoAux', JSON.stringify(Proceso));
  }
  getProcesoAux():proceso{
    let json:any;
    if (localStorage.getItem("ProcesoAux")){
      json=JSON.parse(localStorage.getItem("ProcesoAux")!) as proceso;
      return json;
    }
    return json;
  }
  clearProcesoAux(){
    localStorage.setItem('ProcesoAux', '');
  }

  getUserImagePath(imagePath: string,defaultImagePath:string=''): string {
    const img = new Image();
    img.src = imagePath;
    if (defaultImagePath==''){
      defaultImagePath='assets/images/profile/kevin.png';
    }
    if (img.complete) {
      return imagePath;
    } else {
      img.onerror = () => {
        let i=1;
        return defaultImagePath; //${(i % 10) + 1}
      };
      return  defaultImagePath;
    }
  }
}
