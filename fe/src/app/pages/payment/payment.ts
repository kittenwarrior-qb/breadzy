import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CartService, CartItem } from '../../services/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzButtonModule
  ],
  templateUrl: './payment.html',
  styleUrls: ['./payment.css']
})
export class Payment {
  cartItems$: Observable<CartItem[]>;
  shippingFee = 30000;
  paymentMethod: string = 'cod'; 
  fullName: string = '';
  phone: string = '';
  address: string = '';
  note: string = '';

  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.cartItems$;
  }

  get subtotal(): number {
    return this.cartService.getTotalPrice();
  }

  get total(): number {
    return this.subtotal + this.shippingFee;
  }

  onSubmit(): void {
    if (!this.fullName || !this.phone || !this.address) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng.');
      return;
    }

    const order = {
      fullName: this.fullName,
      phone: this.phone,
      address: this.address,
      note: this.note,
      items: this.cartService.getCartItems(),
      subtotal: this.subtotal,
      shippingFee: this.shippingFee,
      total: this.total
    };

    console.log('Đơn hàng:', order);
    alert('Đơn hàng đã được ghi nhận!');
  }

  get isFormValid(): boolean {
  return !!this.fullName && !!this.phone && !!this.address;
}

}
