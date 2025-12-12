// services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  variantId: string;     
  name: string;         
  slug: string;        
  price: number;
  quantity: number;
  image: string;       
  productSlug: string;   
  variant: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private storageKey = 'my_cart';
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.loadFromStorage());
  cartItems$ = this.cartItemsSubject.asObservable();

  private loadFromStorage(): CartItem[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage(items: CartItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.getValue();
  }

  addToCart(item: CartItem): void {
    const items = this.getCartItems();
    const existing = items.find(i => i.variantId === item.variantId);

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      items.push(item);
    }

    this.cartItemsSubject.next([...items]);
    this.saveToStorage(items);
  }

  removeFromCart(variantId: string): void {
    const items = this.getCartItems().filter(i => i.variantId !== variantId);
    this.cartItemsSubject.next(items);
    this.saveToStorage(items);
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.saveToStorage([]);
  }

  getTotalPrice(): number {
    return this.getCartItems().reduce((total, item) => total + item.price * item.quantity, 0);
  }

  updateQuantity(variantId: string, quantity: number): void {
    if (quantity < 1) return; 

    const updatedItems = this.getCartItems().map(item =>
      item.variantId === variantId ? { ...item, quantity } : item
    );

    this.cartItemsSubject.next(updatedItems);
    this.saveToStorage(updatedItems);
  }

  getTotalQuantity(): number {
    const cart = this.cartItemsSubject.getValue();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

}
