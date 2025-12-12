import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, NzButtonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {
  cartItems$: Observable<CartItem[]>;

  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.cartItems$;
  }

  removeFromCart(variantId: string): void {
    this.cartService.removeFromCart(variantId);
  }

  updateQty(variantId: string, newQty: number): void {
    this.cartService.updateQuantity(variantId, newQty);
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  getTotalQuantity(): number {
    return this.cartService.getTotalQuantity();
  }
}
