import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CartService } from '../../../services/cart.service';


@Component({
  selector: 'app-mini-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NzButtonModule,
    NzDropDownModule,
    NzIconModule
  ],
  templateUrl: './mini-cart.html',
  styleUrls: ['./mini-cart.css']
})
export class MiniCart {
  cartService = inject(CartService);

  updateQty(variantId: string, newQty: number): void {
    this.cartService.updateQuantity(variantId, newQty);
  }

  handleRemove(variantId: string): void {
    this.cartService.removeFromCart(variantId);
  }

  get totalPrice(): number {
    return this.cartService.getTotalPrice();
  }

}

