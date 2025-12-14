import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  NzTableModule,
  NzTableQueryParams
} from 'ng-zorro-antd/table';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadFile, NzUploadModule, NzUploadChangeParam } from 'ng-zorro-antd/upload';

import { VariantService } from '../../../services/variant.service';
import { Variant } from '../../../types/variant';
import slugify from 'slugify';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

@Component({
  selector: 'app-variants',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzDropDownModule,
    NzModalModule,
    NzPopconfirmModule,
    NzIconModule,
    NzUploadModule
  ],
  templateUrl: './variants.html',
  styleUrls: ['./variants.css'],
  providers: [NzModalService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Variants implements OnInit {
  productSlug = '';
  variants: Variant[] = [];
  loading = false;

  pageSize = 10;
  pageIndex = 1;
  searchTerm = '';
  sortBy: string = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';
  pagination = {
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  };

  isModalVisible = false;
  isEditMode = false;

  currentVariant: Variant = {
    _id: '',
    name: '',
    slug: '',
    price: 0,
    gallery: [],
    createdAt: '',
    productSlug: ''
  };

  gallery: NzUploadFile[] = [];
  previewVisible = false;
  previewImage: string = '';
  imageUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private variantService: VariantService,
    private cdr: ChangeDetectorRef,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (!slug) return;

      this.productSlug = slug;
      this.pageIndex = 1;
      this.loadVariants();
    });
  }

  loadVariants(): void {
    this.loading = true;

    this.variantService.getVariantsByProductSlug(
      this.productSlug,
      this.pageIndex,
      this.pageSize,
      slugify(this.searchTerm, { lower: true, strict: true }),
      this.sortBy,
      this.sortOrder
    ).subscribe({
      next: (res) => {
        this.variants = res.data;
        this.pagination = res.pagination;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.message.error('Lỗi khi tải danh sách biến thể');
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  searchVariants(): void {
    this.pageIndex = 1;
    this.loadVariants();
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.loadVariants();
  }

  toggleSort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.loadVariants();
  }

  applySort(field: string, order: 'asc' | 'desc'): void {
    this.sortBy = field;
    this.sortOrder = order;
    this.loadVariants();
  }

  addVariant(): void {
    this.currentVariant = {
      _id: '',
      name: '',
      slug: '',
      price: 0,
      gallery: [],
      createdAt: '',
      productSlug: this.productSlug
    };
    this.gallery = [];
    this.isEditMode = false;
    this.isModalVisible = true;
    this.cdr.markForCheck();
  }

  startEdit(variant: Variant): void {
    this.currentVariant = { ...variant };
    this.gallery = (variant.gallery || []).map((url, index) => ({
      uid: `${index}`,
      name: `Ảnh-${index}.jpg`,
      status: 'done',
      url: url
    }));
    this.isEditMode = true;
    this.isModalVisible = true;
    this.cdr.markForCheck();
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.gallery = [];
    this.cdr.markForCheck();
  }

  handleOk(): void {
    const { name, price } = this.currentVariant;

    if (!name || !price || price <= 0) {
      this.message.error('Vui lòng nhập tên và giá hợp lệ.');
      return;
    }

    const galleryUrls = this.gallery
      .filter(file => file.status === 'done' && !!file.url)
      .map(file => file.url!);

    this.currentVariant.gallery = galleryUrls;

    const formData = {
      productSlug: this.productSlug,
      name: name.trim(),
      price,
      gallery: galleryUrls
    };

    const request$ = this.isEditMode
      ? this.variantService.updateVariant(this.currentVariant._id, formData)
      : this.variantService.createVariant(formData);

    request$.subscribe({
      next: (res) => {
        this.message.success(res?.msg || 'Lưu thành công!');
        this.isModalVisible = false;
        this.loadVariants();
        this.cdr.markForCheck();
      },
      error: (err) => {
        const msg = err?.error?.msg || 'Đã có lỗi xảy ra!';
        this.message.error(msg);
        this.cdr.markForCheck();
      }
    });
  }

  deleteVariant(variant: Variant): void {
    this.variantService.deleteVariant(variant._id).subscribe({
      next: (res) => {
        this.message.success(res?.msg || 'Xóa biến thể thành công!');
        this.loadVariants();
        this.cdr.markForCheck();
      },
      error: (err) => {
        const msg = err?.error?.msg || 'Xóa biến thể thất bại';
        this.message.error(msg);
        this.cdr.markForCheck();
      }
    });
  }

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };

  onUploadChange(info: NzUploadChangeParam): void {
    const { file } = info;

    if (file.status === 'done' && file.response) {
      const res = file.response;
      let uploadedUrls: string[] = [];

      if (Array.isArray(res.data)) {
        uploadedUrls = res.data;
      } else if (typeof res.data === 'string') {
        uploadedUrls = [res.data];
      }

      uploadedUrls.forEach((url, index) => {
        const fileItem: NzUploadFile = {
          uid: `${Date.now()}-${index}`,
          name: `Ảnh-${index + 1}`,
          status: 'done',
          url: url
        };
        this.gallery = [...this.gallery, fileItem];
      });

      this.message.success(res.msg || 'Upload ảnh thành công!');
    }

    if (file.status === 'removed') {
      this.gallery = this.gallery.filter(f => f.uid !== file.uid);
    }
  }

  addImageFromUrl(): void {
    if (!this.imageUrl || !this.imageUrl.trim()) {
      this.message.warning('Vui lòng nhập URL hình ảnh');
      return;
    }

    // Basic URL validation
    try {
      new URL(this.imageUrl);
    } catch {
      this.message.error('URL không hợp lệ');
      return;
    }

    // Check if URL points to an image
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const urlLower = this.imageUrl.toLowerCase();
    const isImageUrl = imageExtensions.some(ext => urlLower.includes(ext)) || 
                       urlLower.includes('image') || 
                       urlLower.includes('img');

    if (!isImageUrl) {
      this.message.warning('URL có vẻ không phải là hình ảnh. Vẫn tiếp tục thêm?');
    }

    const fileItem: NzUploadFile = {
      uid: `url-${Date.now()}`,
      name: `Image from URL`,
      status: 'done',
      url: this.imageUrl.trim()
    };

    this.gallery = [...this.gallery, fileItem];
    this.message.success('Đã thêm hình ảnh từ URL');
    this.imageUrl = '';
    this.cdr.markForCheck();
  }
}
