"use client";
import * as React from "react";
import { useCartStore } from "@/stores/useCartStore";

export default function CartPage() {
  const cart = useCartStore(state => state.items);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const updateQuantity = useCartStore(state => state.updateQuantity);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function handleQuantityChange(id: string, delta: number) {
    const item = cart.find(i => i._id === id);
    if (!item) return;
    const newQuantity = Math.max(1, item.quantity + delta);
    updateQuantity(id, newQuantity);
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-2">
      <h1 className="text-3xl font-bold mb-6">Giỏ hàng</h1>
      {cart.length === 0 ? (
        <div className="text-center text-gray-500">Giỏ hàng của bạn đang trống.</div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Sản phẩm</th>
                <th className="p-3 text-center">Số lượng</th>
                <th className="p-3 text-right">Đơn giá</th>
                <th className="p-3 text-right">Thành tiền</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item._id} className="border-b last:border-b-0">
                  <td className="flex items-center gap-3 p-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <span>{item.name}</span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="inline-flex items-center border rounded">
                      <button
                        className="px-2 py-1 text-lg"
                        onClick={() => handleQuantityChange(item._id, -1)}
                        disabled={item.quantity === 1}
                      >-</button>
                      <span className="px-3 min-w-[2ch] text-center">{item.quantity}</span>
                      <button
                        className="px-2 py-1 text-lg"
                        onClick={() => handleQuantityChange(item._id, 1)}
                      >+</button>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </td>
                  <td className="p-3 text-right">
                    {(item.price * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => removeFromCart(item._id)}
                    >Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end items-center p-4 border-t bg-gray-50">
            <span className="font-semibold mr-4">Tổng cộng:</span>
            <span className="text-xl font-bold">
              {total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </span>
          </div>
          <div className="flex justify-end p-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
              Thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
