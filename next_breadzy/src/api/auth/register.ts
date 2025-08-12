interface RegisterPayload {
  email: string;
  password: string;
}

interface RegisterResponse {
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

export const register = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.msg || "Đăng ký thất bại");
    }

    return await res.json();
  } catch (err) {
    console.error("Lỗi register:", err);
    throw err;
  }
};
