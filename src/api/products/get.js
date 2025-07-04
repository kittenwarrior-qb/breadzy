import axios from "@/lib/axios";

const getAllProducts = async () => {
  try {
    const res = await axios.get("/products");
    return res.data.data;
  } catch (err) {
    console.log("Lỗi fetch sản phẩm:", err);
  }
};

export default getAllProducts;