import { Routes } from '@angular/router';
import { UserLayout } from './layouts/user-layout/user-layout';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Register } from './pages/register/register';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { Products } from './pages/admin/products/products';
import { Variants } from './pages/admin/variants/variants';
import { Users } from './pages/admin/users/users';
import { Categories } from './pages/admin/categories/categories';
import { AuthGuard } from './middlewares/auth';
import { Cart } from './pages/cart/cart';
import { Payment } from './pages/payment/payment';

export const routes: Routes = [
  {
    path: '',
    component: UserLayout,
    children: [
      {
        path: '',
        component: Home
      },
      {
        path: 'login',
        component: Login
      },
      {
        path: 'register',
        component: Register
      },
      {
        path: ':category/:slug/:variantSlug',
        component: ProductDetail
      },
      {
        path: 'cart',
        component: Cart
      },
      {
        path: 'payment',
        component: Payment
      }
    ]
  },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: Dashboard },
      { path: 'products', component: Products },
      { path: 'products/detail/:slug', component: Variants },
      { path: 'categories', component: Categories },
      { path: 'users', component: Users }
    ]
  }
];
