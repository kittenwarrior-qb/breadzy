'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Heart, ShoppingCart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/assets/img/logo.png';
import { DropdownProducts } from './dropdown-products';
import { useAuthStore } from '@/stores/useAuthStore';
import { useCartStore } from '@/stores/useCartStore';

export function Header() {
  const [isAtTop, setIsAtTop] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const totalItems = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );


  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
    window.location.href = `/variants?search=${encodeURIComponent(searchQuery.trim())}`;
      setShowSearch(false); 
    }
  }

  return (
    <header className={`w-full sticky top-0 z-50 bg-white ${isAtTop ? 'shadow-none' : 'shadow-sm'}`}>
      <div className="w-full max-w-[1280px] mx-auto flex flex-row items-center justify-between p-4 gap-5 text-sm font-medium">
        <Button className="md:hidden bg-white text-black">
          <Menu size={24} />
        </Button>

        <div className="hidden md:flex flex-row items-center gap-5">
          <Link href="/shop"><span>CỬA HÀNG</span></Link>
          <DropdownProducts />
          <Link href="/sourdough"><span>BÀI VIẾT</span></Link>
          <Link href="/faq"><span>LIÊN HỆ</span></Link>
        </div>

        <div className="flex items-center justify-center flex-1 md:flex-none transition-all duration-300">
          <Link href="/">
            <img
              src={Logo.src}
              alt="Logo"
              className={`transition-all duration-300 ${isAtTop ? 'w-[400px]' : 'w-[200px]'}`}
            />
          </Link>
        </div>

        <div className="flex flex-row items-center gap-4 md:gap-5">
          <div className="relative">
            <button onClick={() => setShowSearch(!showSearch)}>
              <Search size={15} />
            </button>

            {showSearch && (
              <form
                onSubmit={handleSearchSubmit}
                className="absolute right-0 top-full mt-2 z-50 bg-white border rounded-md shadow-md p-2 flex items-center w-60"
              >
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-2 py-1 text-sm text-black bg-white outline-none"
                  autoFocus
                />
              </form>
            )}
          </div>

          <Link href="/wishlist" className="hidden md:inline">
            <Heart size={15} />
          </Link>
          <Link href="/cart" className="relative">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>


          <div className="hidden md:flex flex-row items-center gap-2">
            {user ? (
              <>
                <span className="btn border p-3 min-w-[200px] text-center">{user.email}</span>
                <Button onClick={handleLogout}>Đăng xuất</Button>
              </>
            ) : (
              <>
                <Button>
                  <Link href="/login"><span>Đăng nhập</span></Link>
                </Button>
                <Button>
                  <Link href="/register"><span>Đăng ký</span></Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
