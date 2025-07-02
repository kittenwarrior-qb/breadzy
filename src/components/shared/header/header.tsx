'use client';

import Link from 'next/link';
import { Search, User, Heart, ShoppingCart } from 'lucide-react';
import Logo from '@/assets/img/logo.png';

export function Header() {
  return (
    <header className="w-full sticky top-0 z-50 bg-white">
      <div className="w-full max-w-[1280px] mx-auto flex flex-row items-center justify-between gap-5 p-4 text-sm font-medium">
        
        <div className="hidden md:flex flex-row items-center gap-5">
          <Link href="/shop"><span>SHOP</span></Link>
          <Link href="/recipes"><span>RECIPES</span></Link>
          <Link href="/sourdough"><span>SOURDOUGH</span></Link>
          <Link href="/blog"><span>BLOG</span></Link>
          <Link href="/faq"><span>FAQ</span></Link>
        </div>

        <div className="flex items-center justify-center flex-1 md:flex-none">
          <Link href="/">
            <img src={Logo.src} alt="Logo" className="w-[150px] sm:w-[180px] md:w-[200px]" />
          </Link>
        </div>

        <div className="flex flex-row items-center gap-4 md:gap-5">
          <div className="hidden md:flex flex-row items-center gap-5">
            <Link href="/connect"><span>CONNECT</span></Link>
            <Link href="/account"><span>MY ACCOUNT</span></Link>
          </div>

          <Link href="/search">
            <Search size={18} />
          </Link>
          <Link href="/user" className="hidden md:inline">
            <User size={18} />
          </Link>
          <Link href="/wishlist" className="hidden md:inline">
            <Heart size={18} />
          </Link>
          <Link href="/cart">
            <ShoppingCart size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
