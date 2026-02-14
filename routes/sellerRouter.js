import express from "express";
import { sellerAuthentication } from "../middlewares/middleware.js";
import { uploadAdMediaAny, uploadAdMediaMulter, uploadStoreImagesMulter, uploadUserImage } from "../helper/uploadImage.js";
import { createSellerStore, updateStoreObjectives, updateStoreLicense, getSellerStoreDetails, updateSellerStore } from "../controllers/sellerStoreController.js";
import { listOfCategories, deleteStoreImage, listSubCategoriesByCategoryId } from "../controllers/storeController.js";
import {
  sendRegisterOtp,
  verifyRegisterOtp,
  updateSellerProfile,
  loginSeller,
  setSellerPassword,
  verifySellerPassword,
  getSellerProfile,
  getSellerDashboard,
  getSellerOrderList,
  getSellerOrderDetails,
  checkSellerStatus,
  updateStoreInfo,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetForgotPassword,
} from "../controllers/sellerController.js";
import { getSellerNotifications, markSellerNotificationRead, clearSellerNotifications, dismissSellerNotification } from "../controllers/notificationController.js";
import { orderChangeStatus } from "../controllers/orderController.js";
import { getSellerInquiries, updateInquiryStatus, deleteInquiry } from "../controllers/slotBookingController.js";
import { createHelpCenterTicket, getSellerHelpTickets } from "../controllers/helpCenterController.js";
import { createSellerAdRequest, listSellerAds, getSellerAdDetails, renewSellerAd, getSellerAdsConfig, deleteSellerAd, createAdPaymentSession, getAdPaymentInfo } from "../controllers/adController.js";

const sellerRouter = express.Router();

// 🔐 Seller Authentication Routes
sellerRouter.post("/seller/send/register/otp/v1", sendRegisterOtp);
sellerRouter.post("/seller/verify/register/otp/v1", verifyRegisterOtp);
sellerRouter.put("/seller/update/profile/v1", sellerAuthentication, uploadUserImage.single('image'), updateSellerProfile);
sellerRouter.post("/seller/login/v1", loginSeller);
sellerRouter.post("/seller/set/password/v1", setSellerPassword);
sellerRouter.post("/seller/verify/password/v1", verifySellerPassword);
sellerRouter.get("/seller/profile/details/v1", sellerAuthentication, getSellerProfile);

// 📊 Seller Dashboard
sellerRouter.get("/seller/dashboard/v1", sellerAuthentication, getSellerDashboard);

// 🔐 Forgot Password Flow
sellerRouter.post("/seller/forgot-password/send-otp/v1", sendForgotPasswordOtp);
sellerRouter.post("/seller/forgot-password/verify-otp/v1", verifyForgotPasswordOtp);
sellerRouter.post("/seller/forgot-password/reset/v1", resetForgotPassword);

// 📦 Seller Orders
sellerRouter.get("/seller/orders/list/v1", sellerAuthentication, getSellerOrderList);
sellerRouter.get("/seller/orders/:id/details/v1", sellerAuthentication, getSellerOrderDetails);
sellerRouter.put("/seller/order/change/status/:id/v1", sellerAuthentication, orderChangeStatus);

// 🔔 Seller Notifications
sellerRouter.get("/seller/notifications/v1", sellerAuthentication, getSellerNotifications);
sellerRouter.patch("/seller/notifications/:id/read/v1", sellerAuthentication, markSellerNotificationRead);
sellerRouter.delete("/seller/notifications/:id/v1", sellerAuthentication, dismissSellerNotification);
sellerRouter.delete("/seller/notifications/clear/v1", sellerAuthentication, clearSellerNotifications);

// 🏪 Seller store creation
sellerRouter.post(
  "/seller/create/store/v1",
  sellerAuthentication,
  uploadStoreImagesMulter.array("images", 10),
  createSellerStore
);

//seller store updation

sellerRouter.put(
  "/seller/update/store/v1",
  sellerAuthentication,
  uploadStoreImagesMulter.array("images", 10),
  updateSellerStore
);

sellerRouter.post(
  "/seller/login/v1/check",
  sellerAuthentication,
  checkSellerStatus
);

sellerRouter.put(
  "/seller/store/update/info/v1",
  sellerAuthentication,
  uploadStoreImagesMulter.array("images", 10),
  updateStoreInfo
);

// 📋 Seller store categories
sellerRouter.get("/seller/categories/list/v1", sellerAuthentication, listOfCategories);
sellerRouter.get("/seller/categories/sub-categories/:categoryId/v1", sellerAuthentication, listSubCategoriesByCategoryId);

// 🎯 Update Store Objectives
sellerRouter.put("/seller/store/objectives/v1", sellerAuthentication, updateStoreObjectives);

// 📄 Update Store License
sellerRouter.put("/seller/store/license/v1", sellerAuthentication, uploadStoreImagesMulter.single("license"), updateStoreLicense);

// 📊 Get Seller Store Details
sellerRouter.get("/seller/store/details/v1", sellerAuthentication, getSellerStoreDetails);

// 🗑️ Delete Store Image
sellerRouter.put("/seller/delete/store/image/v1", sellerAuthentication, deleteStoreImage);

// 📅 Slot Booking / Inquiries
sellerRouter.get("/seller/inquiries/v1", sellerAuthentication, getSellerInquiries);
sellerRouter.put("/seller/inquiry/:inquiryId/status/v1", sellerAuthentication, updateInquiryStatus);
sellerRouter.delete("/seller/inquiry/:inquiryId/v1", sellerAuthentication, deleteInquiry);

// 🆘 Help Center
sellerRouter.get("/seller/help-center/tickets/v1", sellerAuthentication, getSellerHelpTickets);
sellerRouter.post("/seller/help-center/tickets/v1", sellerAuthentication, createHelpCenterTicket);

// 📣 Seller Ads Management
sellerRouter.get("/seller/ads/config/v1", sellerAuthentication, getSellerAdsConfig);
sellerRouter.post(
  "/seller/ads/v1",
  sellerAuthentication,
  uploadAdMediaAny,
  createSellerAdRequest
);
sellerRouter.get("/seller/ads/v1", sellerAuthentication, listSellerAds);
sellerRouter.get(
  "/seller/ads/:id([a-fA-F0-9]{24})/v1",
  sellerAuthentication,
  getSellerAdDetails
);
sellerRouter.post(
  "/seller/ads/:id([a-fA-F0-9]{24})/renew/v1",
  sellerAuthentication,
  renewSellerAd
);
sellerRouter.delete(
  "/seller/ads/:id([a-fA-F0-9]{24})/v1",
  sellerAuthentication,
  deleteSellerAd
);
sellerRouter.post("/seller/ads/payment/session/v1", sellerAuthentication, createAdPaymentSession);
sellerRouter.get("/seller/ads/:id([a-fA-F0-9]{24})/payment/info/v1", sellerAuthentication, getAdPaymentInfo);

export default sellerRouter;

