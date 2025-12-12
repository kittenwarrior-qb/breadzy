import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Variant } from '../types/variant';
import { Product } from '../types/product';
import { Pagination } from '../types/pagination';
// export interface ApiResponse<T = any> {
//   msg: string;
//   data: T;
// }

@Injectable({ providedIn: 'root' })
export class VariantService {
  private apiUrl = 'http://localhost:5050/api/variants';

  constructor(private http: HttpClient) {}

  getFirstVariantByProducts(page = 1,pageSize = 10,search = '',sortBy = 'createdAt',sortOrder = 'desc'): Observable<{
    data: {
        product: Product,
        variant: Variant
    }[];
    msg: string;
    pagination : Pagination
  }> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize))
      .set('search', search)
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);
    return this.http.get<{
      data: {
        product: Product,
        variant: Variant
      }[]
      msg: string;
      pagination: Pagination
    }>(`${this.apiUrl}/get-first-variant`, { params });
  }

  getVariantsByProductSlug(slug: string,page = 1,pageSize = 10,search = '',sortBy = 'createdAt',sortOrder = 'desc'
  ): Observable<{
    data: Variant[];
    msg: string;
    pagination: Pagination
  }> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize))
      .set('search', search)
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    return this.http.get<{
      data: Variant[];
      msg: string;
      pagination: Pagination
    }>(`${this.apiUrl}/product/${slug}`, { params });
  }

  createVariant(data: {
    productSlug: string;
    name: string;
    price: number;
    gallery: string[];
  }): Observable<{ msg: string; data: Variant }> {
    return this.http.post<{ msg: string; data: Variant }>(
      `${this.apiUrl}`,
      data
    );
  }

  updateVariant(id: string, data: {
    productSlug: string;
    name: string;
    price: number;
    gallery: string[];
  }): Observable<{ msg: string; data: Variant }> {
    return this.http.put<{ msg: string; data: Variant }>(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  uploadVariantImages(files: File[]): Observable<{ msg: string; data: string[] }> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('file', file);
    });

    return this.http.post<{ msg: string; data: string[] }>(
      `${this.apiUrl}/upload`,
      formData
    );
  }

  deleteVariant(id: string): Observable<{ msg: string }> {
    return this.http.delete<{ msg: string }>(`${this.apiUrl}/${id}`);
  }

}
