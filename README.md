# Breadzy

**Breadzy** là website thương mại điện tử (E-commerce) bán bánh mì và các sản phẩm ẩm thực, xây dựng với kiến trúc Full-stack hiện đại. Dự án bao gồm Backend API (Node.js + Express + MongoDB) và Frontend (Angular 20), hỗ trợ đầy đủ các tính năng quản lý sản phẩm, giỏ hàng, đơn hàng và xác thực người dùng.

## Tổng quan

Breadzy là một nền tảng thương mại điện tử hoàn chỉnh được thiết kế để bán các sản phẩm bánh mì và đồ ăn. Hệ thống được xây dựng với kiến trúc tách biệt giữa Backend và Frontend, đảm bảo khả năng mở rộng và bảo trì dễ dàng.

## Tính năng chính

### Xác thực & Quản lý người dùng

- Đăng ký và đăng nhập với JWT Authentication
- Phân quyền: Admin, User
- Quản lý profile người dùng
- Quản lý địa chỉ giao hàng
- Quên mật khẩu qua email (Nodemailer)
- Cookie-based session management

### Quản lý sản phẩm

- CRUD sản phẩm với phân trang
- Quản lý danh mục (Categories)
- Upload và quản lý hình ảnh sản phẩm (Multer)
- Tìm kiếm và lọc sản phẩm
- Slug-based URLs cho SEO
- Quản lý tồn kho

### Giỏ hàng & Đặt hàng

- Thêm/xóa/cập nhật sản phẩm trong giỏ hàng
- Kiểm tra tồn kho real-time
- Quản lý đơn hàng
- Theo dõi trạng thái đơn hàng
- Lịch sử mua hàng

### Trang Admin

- Dashboard thống kê
- Quản lý sản phẩm
- Quản lý đơn hàng
- Quản lý người dùng
- Quản lý danh mục

## Công nghệ sử dụng

### Backend (Node.js)

- **Framework**: Express.js 5.1.0
- **Database**: MongoDB + Mongoose 8.14.1
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **File Upload**: Multer 2.0.1
- **Email**: Nodemailer 7.0.0
- **Environment**: dotenv
- **Utilities**: slugify, cookie-parser, cors

### Frontend (Angular)

- **Framework**: Angular 20.0.0
- **UI Library**: NG-ZORRO (Ant Design for Angular) 20.0.0
- **Styling**: TailwindCSS 4.1.11
- **Icons**: Lucide Angular
- **HTTP Client**: RxJS 7.8.0
- **Routing**: Angular Router
- **SSR**: Angular SSR

### Clone repository

```bash
git clone https://github.com/kittenwarrior-qb/breadzy.git
cd breadzy
```

### Cài đặt Backend

```bash
cd be
npm install

# Tạo file .env từ .env.example
cp .env.example .env

# Cấu hình MongoDB connection trong .env
# MONGODB_URI=mongodb://localhost:27017/breadzy
# JWT_SECRET=your_secret_key
# PORT=3000
```

### Cài đặt Frontend

```bash
cd ../fe
npm install

# Tạo file .env từ .env.example (nếu cần)
cp .env.example .env
```

### Khởi động Development

**Terminal 1 - Backend:**
```bash
cd be
npm run dev
# Server chạy tại: http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd fe
npm start
# hoặc: ng serve
# App chạy tại: http://localhost:4200
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/forgot-password` - Quên mật khẩu

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm mới (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)

### Cart
- `GET /api/cart` - Lấy giỏ hàng
- `POST /api/cart` - Thêm sản phẩm vào giỏ
- `PUT /api/cart/:id` - Cập nhật số lượng
- `DELETE /api/cart/:id` - Xóa sản phẩm khỏi giỏ

### Orders
- `GET /api/orders` - Lấy danh sách đơn hàng
- `GET /api/orders/:id` - Chi tiết đơn hàng
- `POST /api/orders` - Tạo đơn hàng mới
- `PUT /api/orders/:id` - Cập nhật trạng thái (Admin)

## 📚 API Documentation

Breadzy sử dụng **Swagger/OpenAPI 3.0** để cung cấp tài liệu API tương tác đầy đủ.

### Truy cập Swagger UI

Sau khi khởi động backend server, truy cập:

```
http://localhost:3000/api-docs
```

Swagger UI cung cấp:
- 📖 Tài liệu đầy đủ cho tất cả endpoints
- 🧪 Giao diện test API trực tiếp
- 📝 Schemas cho requests và responses
- 🔐 Hỗ trợ JWT authentication

### Sử dụng Authentication trong Swagger

1. Đăng ký/Đăng nhập qua endpoint `/api/auth/login`
2. Copy JWT token từ response
3. Click nút **"Authorize"** ở góc trên bên phải
4. Nhập token vào ô `bearerAuth` (format: `Bearer <token>`)
5. Click **"Authorize"** và **"Close"**
6. Bây giờ bạn có thể test các protected endpoints

### Backend (.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/breadzy
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### Frontend (.env)
```env
API_URL=http://localhost:3000/api
```

## 📦 Dependencies

### Backend chính
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `multer` - File upload
- `nodemailer` - Email service
- `express-validator` - Request validation

### Frontend chính
- `@angular/core` - Angular framework
- `ng-zorro-antd` - UI components
- `tailwindcss` - Utility-first CSS
- `lucide-angular` - Icon library
- `rxjs` - Reactive programming

## 👥 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request
