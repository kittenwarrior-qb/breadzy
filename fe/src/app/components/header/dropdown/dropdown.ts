import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Observable, of } from 'rxjs';

import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { VariantService } from '../../../services/variant.service';

import type { Category } from '../../../types/category';
import type { Product } from '../../../types/product';

import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-product-dropdown',
  standalone: true,
  imports: [CommonModule, RouterModule, NzDropDownModule, NzMenuModule, NzIconModule],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.css'
})
export class ProductDropdown implements OnInit {
  menuData$!: Observable<{
    category: Category;
    products: (Product & { variantSlug?: string })[];
  }[]>;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private variantService: VariantService,
      private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.categoryService.getAllCategories(1, 1000).subscribe({
      next: (categoryRes) => {
        const categories = categoryRes.data;

        this.productService.getAllProducts(1, 1000).subscribe({
          next: (productRes) => {
            const products = productRes.data;
            const productsWithVariants: (Product & { variantSlug?: string })[] = [];

            let count = 0;

            products.forEach((product) => {
              this.variantService.getVariantsByProductSlug(product.slug).subscribe({
                next: (variantRes) => {
                  const variant = variantRes?.data?.[0];
                  productsWithVariants.push({
                    ...product,
                    variantSlug: variant?.slug
                  });
                  checkDone();
                },
                error: (err) => {
                  console.warn(`Không lấy được variant cho ${product.name}`, err);
                  productsWithVariants.push({ ...product });
                  checkDone();
                }
              });
            });

            const checkDone = () => {
              count++;
              if (count === products.length) {
                const groupedData = categories.map((category) => ({
                  category,
                  products: productsWithVariants.filter((p) => p.category === category.slug)
                }));
                this.menuData$ = of(groupedData);
                this.cdr.detectChanges();
              }
            };
          },
          error: (err) => {
            console.error('Lỗi khi lấy sản phẩm:', err);
            this.menuData$ = of([]);
          }
        });
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh mục:', err);
        this.menuData$ = of([]);
      }
    });
  }


}
