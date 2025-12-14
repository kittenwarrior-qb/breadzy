import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { ProductService } from '../../../services/product.service';
import { VariantService } from '../../../services/variant.service';
import { AuthService } from '../../../services/auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NzCardModule, NzIconModule, NzStatisticModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  loading = true;
  totalUsers = 0;
  totalProducts = 0;
  totalVariants = 0;

  constructor(
    private productService: ProductService,
    private variantService: VariantService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.loading = true;

    // Fetch all statistics in parallel
    forkJoin({
      products: this.productService.getAllProducts(1, 1),
      variants: this.variantService.getFirstVariantByProducts(1, 1)
    }).subscribe({
      next: (results) => {
        this.totalProducts = results.products.pagination.total;
        this.totalVariants = results.variants.pagination.total;
        // For users, we'll use a placeholder since there's no user count endpoint
        this.totalUsers = 0; // Will be updated if auth service has user count
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
