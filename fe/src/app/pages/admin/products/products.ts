import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import type { Product } from '../../../types/product';
import type { Category } from '../../../types/category';

import slugify from 'slugify';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzPopconfirmModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzMenuModule,
    NzDropDownModule,
    NzSelectModule,
    NzSwitchModule,
    RouterLink
  ],
  providers: [NzModalService],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Products implements OnInit {
  products: Product[] = [];
  categoryOptions: Category[] = [];
  loading = false;

  pageSize = 10;
  pageIndex = 1;
  pagination = { total: 0, pageSize: 10, totalPages: 1, page: 1, sortBy: '', sortOrder: '' };
  searchTerm = '';
  sortBy = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';

  isModalVisible = false;
  isEditMode = false;

  currentProduct: Product = {
    _id: '',
    name: '',
    slug: '',
    description: '',
    price: 0,
    category: '',
    isHot: false,
    createdAt: ''
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories(1, 100).subscribe({
      next: (res) => {
        this.categoryOptions = res.data;
        this.cdr.markForCheck(); // ✅ giữ lại
      },
      error: () => {
        this.message.error('Lỗi khi tải danh sách danh mục.');
      }
    });
  }

  loadProducts(): void {
    this.loading = true;

    const slugified = slugify(this.searchTerm, { lower: true, strict: true });

    this.productService.getAllProducts(this.pageIndex, this.pageSize, slugified, this.sortBy, this.sortOrder)
      .subscribe({
        next: (res) => {
          this.products = res.data;
          this.pagination = res.pagination as any;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.message.error('Lỗi khi tải sản phẩm.');
          this.loading = false;
          this.cdr.markForCheck(); 
        }
      });
  }

  searchProducts(): void {
    this.pageIndex = 1;
    this.loadProducts();
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.loadProducts();
  }

  applySort(field: string, order: 'asc' | 'desc'): void {
    this.sortBy = field;
    this.sortOrder = order;
    this.loadProducts();
  }

  sortByField(sortField: string): void {
    if (this.sortBy === sortField) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortField;
      this.sortOrder = 'asc';
    }
    this.loadProducts();
  }

  startEdit(p: Product): void {
    this.currentProduct = { ...p };
    this.isEditMode = true;
    this.isModalVisible = true;
  }

  addProduct(): void {
    this.currentProduct = {
      _id: '',
      name: '',
      slug: '',
      description: '',
      price: 0,
      category: '',
      isHot: false,
      createdAt: ''
    };
    this.isEditMode = false;
    this.isModalVisible = true;
  }

  handleOk(): void {
    const { name, description, category } = this.currentProduct;

    if (!name || !description || !category) {
      this.message.error('Vui lòng nhập đầy đủ tên, mô tả và chọn danh mục.');
      return;
    }

    this.currentProduct.slug = slugify(name.trim(), { lower: true, strict: true });

    const request$ = this.isEditMode
      ? this.productService.updateProduct(this.currentProduct._id, this.currentProduct)
      : this.productService.createProduct(this.currentProduct);

    request$.subscribe({
      next: (res) => {
        this.message.success(res?.msg || (this.isEditMode ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!'));
        this.isModalVisible = false;
        this.loadProducts();
      },
      error: (err) => {
        const msg = err?.error?.msg || (this.isEditMode ? 'Lỗi cập nhật sản phẩm.' : 'Lỗi thêm sản phẩm.');
        this.message.error(msg);
      }
    });
  }

  deleteProduct(p: Product): void {
    this.productService.deleteProduct(p._id).subscribe({
      next: (res) => {
        this.message.success(res?.msg || 'Xóa sản phẩm thành công!');
        this.loadProducts();
      },
      error: (err) => {
        const msg = err?.error?.msg || 'Xóa sản phẩm thất bại.';
        this.message.error(msg);
      }
    });
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }
}
