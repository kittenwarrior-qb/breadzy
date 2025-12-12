import { StatusCodes } from "http-status-codes";

export const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(StatusCodes.UNAUTHORIZED).json({msg: "Chưa xác thực người dùng",}
    );

    const { role } = req.user;
    if (!roles.includes(role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ msg: "Bạn không có quyền truy cập",}
    );
    }

    next();
  };
};
