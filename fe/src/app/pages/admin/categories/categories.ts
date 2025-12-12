import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../types/category';
import { NzTableQueryParams, NzTableModule } from 'ng-zorro-antd/table';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import slugify from 'slugify';

@Component({
  selector: 'app-categories',
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
    NzDropDownModule
  ],
  providers: [NzModalService],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Categories implements OnInit {
  categories: Category[] = [];
  loading = false;

  pageSize = 10;
  pageIndex = 1;
  pagination = { total: 0, pageSize: 10, totalPages: 1, page: 1 };
  searchTerm = '';
  sortBy: string = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';

  isModalVisible = false;
  isEditMode = false;
  currentCategory: Category = { _id: '', name: '', slug: '', createdAt: '' };

  constructor(
    private categoryService: CategoryService,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;

    const searchSlug = slugify(this.searchTerm, { lower: true, strict: true });

    this.categoryService.getAllCategories(
      this.pageIndex,
      this.pageSize,
      searchSlug,
      this.sortBy,
      this.sortOrder
    ).subscribe({
      next: (response) => {
        this.categories = response.data;
        this.pagination = response.pagination;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.message.error('Lỗi khi tải danh mục.');
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  searchCategories(): void {
    this.pageIndex = 1;
    this.loadCategories();
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.loadCategories();
  }

  applySort(field: string, order: 'asc' | 'desc'): void {
    this.sortBy = field;
    this.sortOrder = order;
    this.loadCategories();
  }

  sortByField(sortField: string): void {
    if (this.sortBy === sortField) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortField;
      this.sortOrder = 'asc';
    }
    this.loadCategories();
  }

  startEdit(category: Category): void {
    this.currentCategory = { ...category };
    this.isEditMode = true;
    this.isModalVisible = true;
  }

  addCategory(): void {
    this.currentCategory = { _id: '', name: '', slug: '', createdAt: '' };
    this.isEditMode = false;
    this.isModalVisible = true;
  }

  handleOk(): void {
    const name = this.currentCategory.name.trim();
    if (!name) {
      this.message.error('Vui lòng nhập tên danh mục.');
      return;
    }

    const request = this.isEditMode
      ? this.categoryService.updateCategory(this.currentCategory._id, name)
      : this.categoryService.createCategory(name);

    request.subscribe({
      next: (res) => {
        this.message.success(
          res?.msg || (this.isEditMode ? 'Cập nhật thành công!' : 'Thêm thành công!')
        );
        this.isModalVisible = false;
        this.loadCategories();
      },
      error: (err) => {
        const msg = err?.error?.msg || (this.isEditMode ? 'Lỗi cập nhật.' : 'Lỗi thêm mới.');
        this.message.error(msg);
      }
    });
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }

  deleteCategory(category: Category): void {
    this.categoryService.deleteCategory(category._id).subscribe({
      next: (res) => {
        this.message.success(res?.msg || 'Xóa thành công!');
        this.loadCategories();
      },
      error: (err) => {
        const msg = err?.error?.msg || 'Xóa thất bại.';
        this.message.error(msg);
      }
    });
  }
}
