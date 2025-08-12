interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  msg: string;
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    role: string;
    fullName?: string;
    phone?: string;
  };
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.msg || "Đăng nhập thất bại");
    }

    return await res.json();
  } catch (err) {
    console.error("Lỗi login:", err);
    throw err;
  }
};
