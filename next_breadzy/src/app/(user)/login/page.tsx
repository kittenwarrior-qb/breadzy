"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { login } from "@/api/auth/login";
import { toast } from "sonner";

export default function Login() {
  const { setUser, setAccessToken, setRefreshToken } = useAuthStore();

  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: true,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await login({
        email: form.username,
        password: form.password,
      });

      setUser(data.user);
      setAccessToken(data.accessToken);

      if (form.remember) {
        setRefreshToken(data.refreshToken);
      } else {
        setRefreshToken(""); // Xóa nếu không nhớ
      }

      toast.success("Đăng nhập thành công");
      window.location.href = "/";
    } catch (err) {
      toast.error("Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center my-20 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Email</Label>
              <Input
                id="username"
                name="username"
                placeholder="Nhập email hoặc tên người dùng"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  id="remember"
                  name="remember"
                  checked={form.remember}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      remember: Boolean(checked),
                    }))
                  }
                />
                Nhớ đăng nhập
              </label>
              <a className="hover:underline cursor-pointer">
                Quên mật khẩu?
              </a>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <hr className="flex-1 border-gray-300" />
              <span>hoặc</span>
              <hr className="flex-1 border-gray-300" />
            </div>

            <Link
              href="/register"
              className="block text-center text-sm border border-gray-300 hover:border-gray-400 rounded py-2 mt-2 text-gray-700 hover:text-black transition"
            >
              Tạo tài khoản mới
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
