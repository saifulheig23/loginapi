import httpStatus from "http-status";
import { config } from "../../config";
import apiResponse from "../../utils/apiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { authService } from "./auth.service";

// user sign up
const userSignUp = asyncHandler(async (req, res) => {
  const userData = req.body;
  const result = await authService.userSignUp(userData);

  apiResponse(
    res,
    httpStatus.OK,
    "OTP sent to email for creating account",
    result
  );
});

//**  user login  **//
// const userLogin = asyncHandler(async (req, res) => {
//   const result = await authService.userLogin(req.body);
//   const { _id, name, email, role, phone, address } = result.isUserExist;

//   //set refresh token in cookie
//   res.cookie("refreshToken", result.refreshToken, {
//     httpOnly: true,
//     secure: config.node_env === "production",
//   });

//   res.status(httpStatus.OK).json({
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "User logged in successfully",
//     token: result.accessToken,
//     data: {
//       _id,
//       name,
//       email,
//       role,
//       phone,
//       address,
//     },
//   });
// });

//** login user with OTP  **/
const userLogin = asyncHandler(async (req, res) => {
  const result = await authService.userLogin(req.body);

  apiResponse(res, httpStatus.OK, "OTP sent to email", result);
});

//* Verify OTP and  login *//
const verifyLoginOtp = asyncHandler(async (req, res) => {
  const result = await authService.verifyLoginOtp(req.body);
  const { _id, name, email, role, phone, address } = result.isUserExist;

  //set refresh token in cookie
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: config.node_env === "production",
  });

  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    token: result.accessToken,
    data: {
      _id,
      name,
      email,
      role,
      phone,
      address,
    },
  });
});

//** forgot password **/
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  console.log("from frontend", req.body);

  // const hostUrl = `${req.protocol}://${req.get('host')}`
  const hostUrl = `http://localhost:5173`;

  const result = await authService.forgotPassword(email, hostUrl);

  apiResponse(
    res,
    httpStatus.OK,
    "Password reset link sent to email. Please check your email",
    result
  );
});

// ** reset password **//
const resetPassword = asyncHandler(async (req, res) => {
  const token = req.params.token;
  const password = req.body.password;

  const result = await authService.resetPassword({ token, password });

  apiResponse(
    res,
    httpStatus.OK,
    "Password reset successfully. Please log in",
    result
  );
});

export const authController = {
  userSignUp,
  userLogin,
  verifyLoginOtp,
  forgotPassword,
  resetPassword,
};
