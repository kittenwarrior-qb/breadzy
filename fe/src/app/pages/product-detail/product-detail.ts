import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VariantService } from '../../services/variant.service';
import { Variant } from '../../types/variant';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';

import { CartService, type CartItem } from '../../services/cart.service';

type VariantImage = {
  url: string;
  variantSlug: string;
};

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NzButtonModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetail implements OnInit {
  productSlug: string = '';
  variantSlug: string = '';
  variantList: Variant[] = [];
  variant: Variant | null = null;
  selectedImage: string = '';
  allImages: VariantImage[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private variantService: VariantService,
    private cartService: CartService,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // Read all route parameters including category
      const category = params.get('category') || '';
      this.productSlug = params.get('slug') || '';
      this.variantSlug = params.get('variantSlug') || '';
      
      console.log('Route params:', { category, slug: this.productSlug, variantSlug: this.variantSlug });
      
      if (this.productSlug) {
        this.fetchVariant();
      }
    });
  }

  fetchVariant() {
    this.variantService.getVariantsByProductSlug(this.productSlug).subscribe(response => {
      this.variantList = response.data;

      if (!this.variantList || this.variantList.length === 0) {
        console.warn('Không có variant nào được trả về!');
        return;
      }

      this.allImages = this.variantList.flatMap(v =>
        v.gallery.map(img => ({
          url: img,
          variantSlug: v.slug
        }))
      );

      if (this.variantSlug) {
        const found = this.variantList.find(v => v.slug === this.variantSlug);
        this.variant = found || this.variantList[0];
      } else {
        this.variant = this.variantList[0];
      }

      this.selectedImage = this.variant.gallery[0] || '';
      this.cdr.detectChanges();
    });
  }

  selectImageAndVariant(image: VariantImage) {
    const targetVariant = this.variantList.find(v => v.slug === image.variantSlug);
    if (targetVariant) {
      this.variant = { ...targetVariant };
      this.selectedImage = image.url;
      this.router.navigate(['/product', this.productSlug, image.variantSlug]);
    }
  }

  selectVariant(v: Variant) {
    this.variant = { ...v };
    this.selectedImage = v.gallery[0] || '';
    this.router.navigate(['/product', this.productSlug, v.slug]);
  }

  addCartItem(): void {
    if (!this.variant) {
      console.warn('No variant selected!');
      return;
    }
    const item: CartItem = {
      variantId: this.variant._id,
      name: this.variant.name,
      slug: this.variant.slug,
      price: this.variant.price,
      quantity: 1,
      image: this.selectedImage,
      productSlug: this.variant.productSlug,
      variant: this.variant.name,
    };

    this.cartService.addToCart(item);
    this.message.success('Thêm giỏ hàng thành công')
  }

}
