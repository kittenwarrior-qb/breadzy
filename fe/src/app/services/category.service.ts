import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Category } from '../types/category';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = 'http://localhost:5050/api/categories';

  constructor(private http: HttpClient) {}
  getAllCategories(page = 1, pageSize = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc'): Observable<{ data: Category[], msg: string, pagination: { total: number, page: number, pageSize: number, totalPages: number } }> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize))
      .set('search', search)
      .set('sortBy', sortBy) 
      .set('sortOrder', sortOrder);

    return this.http.get<{ data: Category[], msg: string, pagination: { total: number, page: number, pageSize: number, totalPages: number } }>(this.apiUrl, { params });
  }

  getCategoryBySlug(slug: string): Observable<{ data: Category }> {
    return this.http.get<{ data: Category }>(`${this.apiUrl}/${slug}`);
  }

  createCategory(name: string): Observable<{ data: Category; msg: string }> {
    return this.http.post<{ data: Category; msg: string }>(this.apiUrl, { name });
  }

  updateCategory(id: string, name: string): Observable<{ data: Category; msg: string }> {
    return this.http.put<{ data: Category; msg: string }>(`${this.apiUrl}/${id}`, { name });
  }

  deleteCategory(id: string): Observable<{ msg: string }> {
    return this.http.delete<{ msg: string }>(`${this.apiUrl}/${id}`);
  }

}
