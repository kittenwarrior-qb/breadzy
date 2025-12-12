// default libs
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ChangeDetectorRef } from '@angular/core';

// ng-zorro libs
import { NzSkeletonModule, } from 'ng-zorro-antd/skeleton';  

// services
import { VariantService } from '../../../../services/variant.service';

export interface DisplayProduct {
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  slug: string;
  variantSlug: string
}

@Component({
  selector: 'app-products-section',
  standalone: true,
  imports: [CommonModule, RouterLink, NzSkeletonModule],
  templateUrl: './products-section.html',
  styleUrls: ['./products-section.css']
})

export class ProductsSection implements OnInit {
  products: DisplayProduct[] = [];
  loading: boolean = true;

  constructor(
    private variantService: VariantService,
    private cdr: ChangeDetectorRef

  ) {}

  ngOnInit() {
    this.variantService.getFirstVariantByProducts()
      .subscribe({
        next: (response) => {
          const data = response?.data || [];

          this.products = data.map(({ product, variant }) => ({
            ...product,
            price: variant.price,
            image: variant.gallery?.[0] || '',
            variantSlug: variant.slug,
          }));

          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Lỗi khi fetch sản phẩm:', error);
          this.loading = false;
        }
      });
  }

}
