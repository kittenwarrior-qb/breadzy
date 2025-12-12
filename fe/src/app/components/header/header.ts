import { Component, HostListener, inject, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
import { ProductDropdown } from './dropdown/dropdown';
import { NzMessageService } from 'ng-zorro-antd/message';

import { CartService } from '../../services/cart.service';

import { MiniCart } from './mini-cart/mini-cart';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NzIconModule,
    NzDropDownModule,
    NzButtonModule,
    ProductDropdown,
    MiniCart
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements OnInit {
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef); 
  private message = inject(NzMessageService);
  cartService = inject(CartService);

  isAtTop = true;
  isLoggedIn = false;
  userEmail = '';
  @HostListener('window:scroll')
  onWindowScroll() {
    this.isAtTop = window.scrollY === 0;
  }

  ngOnInit() {
    this.authService.isLoggedIn$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((ok) => (this.isLoggedIn = ok));

    this.authService.email$
      .pipe(takeUntilDestroyed(this.destroyRef)) 
      .subscribe((email) => (this.userEmail = email || ''));
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.message.success('Đăng xuất thành công!');  
    });
  }

}
