import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Product } from '../types/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:5050/api/products';

  constructor(private http: HttpClient) {}

  getAllProducts(page = 1,pageSize = 10,search = '',sortBy = 'createdAt',sortOrder = 'desc'): Observable<{
    data: Product[];
    msg: string;
    pagination: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
      sortBy: string;
      sortOrder: string;
    };
  }> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize))
      .set('search', search)
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    const json = this.http.get<{
      data: Product[];
      msg: string;
      pagination: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
        sortBy: string;
        sortOrder: string;
      };
    }>(this.apiUrl, { params });
    return json
  }

  getProductBySlug(slug: string) {
    return this.http.get<{ data: Product }>(`${this.apiUrl}/slug/${slug}`);
  }

  createProduct(product: { name: string; category: string; isHot?: boolean }): Observable<{ data: Product; msg: string }> {
    return this.http.post<{ data: Product; msg: string }>(this.apiUrl, product);
  }

  updateProduct(id: string, product: { name: string; category: string; isHot?: boolean }): Observable<{ data: Product; msg: string }> {
    return this.http.put<{ data: Product; msg: string }>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<{ msg: string }> {
    return this.http.delete<{ msg: string }>(`${this.apiUrl}/${id}`);
  }
}
