import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment.development';
import { IResponse, IResponse3 } from 'src/app/shared/wrappers/response';
import { IPagedResult ,IPagedResult2} from 'src/app/shared/wrappers/pagedResult';
import { UploadedImage } from 'src/app/shared/controls/upload-file/upload-file.component';

// Interface para el producto que viene de la API
export interface Product2 {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  sku?: string;
  isActive?: boolean;
  images?: UploadedImage[];
  selected?: boolean;
}

export interface Product {
  AlternateBarcodes: string;
  AverageCost: number;
  Blocked: boolean;
  Categoria: string;
  CategoryId: number;
  CodBar: string;
  Code: string;
  ColorID: number;
  CostoRef: number;
  CostoU: number;
  DefaultWarehouse: number;
  Description: string;
  Descuento: number;
  ForPurchase: boolean;
  ForSales: boolean;
  GroupID: number;
  Id: string;
  ImageUrl: string;
  Images: string;
  LastPurchaseCost: number;
  LastPurchaseDate: string; // Consider using Date type if you plan to parse it
  LastPurchaseNo: number;
  Location: string;
  Marca: string;
  MarcaID: number;
  MetodoID: number;
  Modelo: string;
  Name: string;
  NetCost: number;
  PDesMin1: number;
  PDesMin2: number;
  PDesMin3: number;
  PDesMin4: number;
  PDesMin5: number;
  PDesMin6: number;
  PDesMin7: number;
  PDesMin8: number;
  Packaging: any;
  Price: number;
  Price1U: number;
  Price2U: number;
  Price3U: number;
  Price4U: number;
  Price5U: number;
  Price6U: number;
  Price7U: number;
  Price8U: number;
  ProductId: number;
  Reference: string;
  SKUs: any;
  SRIVATCode: number;
  Size: string;
  SizeID: number;
  Stock: number;
  StockMax: number;
  StockMin: number;
  StylexsaVATCode: number;
  Subgrupo: string;
  Supplier1Code: string;
  Supplier2Code: string;
  TaxRate: number;
  Taxes: any;
  Tipo: number;
  To_0: number;
  To_1: number;
  To_2: number;
  Ubicacion: string;
  Volume: number;
  VolumeUnit: string ;
  WarehouseStock: any;
  Weight: number;
  WeightUnit: string;
  ivainc: boolean;
  priceRef: number;

  isActive?: boolean;
  images?: UploadedImage[];
  selected?: boolean;

}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  #http: HttpClient = inject(HttpClient);

  constructor() { }

  // Obtener todos los productos con paginación
  getProducts(pageSize: number, pageNumber: number, searchTerm?: string, filterParams?: object): Observable<IPagedResult<Product>> {
    let params: HttpParams = new HttpParams();
    params = params.append('PageSize', pageSize);
    params = params.append('PageNumber', pageNumber);
    if (searchTerm) {
      params = params.append('SearchTerm', searchTerm);
    }
    
    // Agregar filtros adicionales si existen
    if (filterParams) {
      Object.entries(filterParams).forEach(([key, value]) => {
        params = params.append(key, value as string);
      });
    }
    
    let api = 'Products/Pagging';
    let url = `${environment.basePathUrl}/${api}`;
    return this.#http.get<IPagedResult<Product>>(url, { params });
  }

  // Obtener un producto por ID
  getProductById(id: string): Observable<IResponse<Product>> {
    let api = 'Products';
    let url = `${environment.basePathUrl}/${api}/${id}`;
    return this.#http.get<IResponse<Product>>(url);
  }


} 