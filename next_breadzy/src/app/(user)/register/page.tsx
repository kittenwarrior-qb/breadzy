"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { register } from "@/api/auth/register";

export default function Register() {
  const { setUser, setAccessToken } = useAuthStore();

  const [form, setForm] = useState({
    email: "",
    password: "",
    reenterPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (form.password !== form.reenterPassword) {
      toast.error("Mật khẩu không khớp");
      setLoading(false);
      return;
    }

    try {
      const data = await register({
        email: form.email,
        password: form.password,
      });

      setUser(data.user);
      setAccessToken(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);

      toast.success("Đăng ký thành công");
      window.location.href = "/";
    } catch (err) {
      toast.error("Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center my-20 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Tạo tài khoản</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="Nhập email"
                value={form.email}
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

            <div className="space-y-2">
              <Label htmlFor="reenterPassword">Nhập lại mật khẩu</Label>
              <Input
                id="reenterPassword"
                name="reenterPassword"
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={form.reenterPassword}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </Button>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <hr className="flex-1 border-gray-300" />
              <span>hoặc</span>
              <hr className="flex-1 border-gray-300" />
            </div>

            <Link
              href="/login"
              className="block text-center text-sm border border-gray-300 hover:border-gray-400 rounded py-2 mt-2 text-gray-700 hover:text-black transition"
            >
              Đã có tài khoản? Đăng nhập
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
