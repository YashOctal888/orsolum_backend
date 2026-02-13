import express from "express";
import { body } from 'express-validator';
import {
  createAdmin,
  loginAdmin,
  uploadStoreCategoryImage,
  createStoreCategory,
  editStoreCategory,
  deleteStoreCategory,
  listStoreCategory,
  listStores,
  storeDetails,
  acceptStore,
  rejectStore,
  createStore,
  deleteStore,
  listProducts,
  productDetails,
  acceptProduct,
  rejectProduct,
  deleteLocalProduct,
  createCouponCode,
  updateCouponCode,
  deleteCouponCode,
  listCouponCode,
  createMembership,
  updateMembership,
  getMembershipDetails,
  listUsers,
  userDetails,
  inActiveUserDetails,
  listPayments,
  paymentDetails,
  listLocalStoreOrders,
  localStoreOrderDetails,
  listOnlineOrders,
  onlineOrderDetails,
  getOnlineReturnOrder,
  getReturnOrderDetails,
  returnAdminChangeStatus,
  createOffer,
  listOffers,
  updateOffer,
  deleteOffer,
  getWelcomeImage,
  uploadWelcomeImage,
  deleteWelcomeImage,
  saveStorePopularProducts,
  updateStoreRating,
  listAdmins,
  updateAdminPassword,
  deleteAdmin
} from "../controllers/adminController.js";
import { superadminAuthentication, userAuthentication } from "../middlewares/middleware.js";
import { createWorkHours, getAllWorkHours, updateWorkHours, deleteWorkHours } from "../controllers/workHoursController.js";
import { createNotification, listNotifications, deleteNotification } from "../controllers/notificationController.js";
import {
  loginSuperadmin,
  me,
  staffMembers,
  createStaffMember,
  getPaymentConfigurations,
  savePaymentConfigurations
} from "../controllers/superadminController.js";
import RolePermissionController from "../controllers/RolePermissionController.js";
import CategoryController from "../controllers/CategoryController.js";
const superadminRouter = express.Router();


// Superadmin Authentication
superadminRouter.post('/login/superadmin/v1', loginSuperadmin);
superadminRouter.get('/superadmin/me/v1',superadminAuthentication,me)

// Role and Permissions
superadminRouter.get("/superadmin/staff-members", superadminAuthentication, staffMembers);
superadminRouter.post("/superadmin/create/staff-member", superadminAuthentication, createStaffMember);
superadminRouter.get("/superadmin/roles", superadminAuthentication, RolePermissionController.roles)
superadminRouter.get("/superadmin/role/:id", superadminAuthentication, RolePermissionController.getRoleById);
superadminRouter.post("/superadmin/role/create", superadminAuthentication, RolePermissionController.createRole)
superadminRouter.put("/superadmin/role/:id", superadminAuthentication, RolePermissionController.updateRole);
superadminRouter.delete("/superadmin/roles/:id",superadminAuthentication, RolePermissionController.deleteRole);
superadminRouter.get("/superadmin/permissions", superadminAuthentication, RolePermissionController.permissions)


// Admin Management (Superadmin Only)
superadminRouter.get("/superadmin/list/admins/v1", superadminAuthentication, listAdmins);
superadminRouter.put("/superadmin/update/admin/password/:id/v1", superadminAuthentication, updateAdminPassword);
superadminRouter.delete("/superadmin/delete/admin/:id/v1", superadminAuthentication, deleteAdmin);

// Store Categories

superadminRouter.post('/superadmin/upload/store/category/image/v1', [
  body('sFileName').not().isEmpty(),
  body('sContentType').not().isEmpty()
], superadminAuthentication, uploadStoreCategoryImage);
superadminRouter.get('/superadmin/list/store/category/v1', superadminAuthentication, CategoryController.index);
superadminRouter.post('/superadmin/create/store/category/v1', superadminAuthentication, CategoryController.store);
superadminRouter.put('/superadmin/edit/store/category/:id/v1', superadminAuthentication, CategoryController.update);
superadminRouter.delete('/superadmin/delete/store/category/:id/v1', superadminAuthentication, CategoryController.destroy);

// Store Management
superadminRouter.get('/superadmin/list/store/v1', superadminAuthentication, listStores);
superadminRouter.get('/superadmin/store/details/:id/v1', superadminAuthentication, storeDetails);
superadminRouter.post('/superadmin/accept/store/v1', superadminAuthentication, acceptStore);
superadminRouter.post('/superadmin/reject/store/v1', superadminAuthentication, rejectStore);
superadminRouter.post('/superadmin/create/store/v1', superadminAuthentication, createStore);
superadminRouter.delete('/superadmin/delete/store/:id/v1', superadminAuthentication, deleteStore);
superadminRouter.put('/superadmin/store/:id/rating/v1', superadminAuthentication, updateStoreRating);

// Product Management
superadminRouter.get('/superadmin/list/product/v1', superadminAuthentication, listProducts);
superadminRouter.get('/superadmin/product/details/:id/v1', superadminAuthentication, productDetails);
superadminRouter.post('/superadmin/accept/product/v1', superadminAuthentication, acceptProduct);
superadminRouter.post('/superadmin/reject/product/v1', superadminAuthentication, rejectProduct);
superadminRouter.delete('/superadmin/delete/local/product/:id/v1', superadminAuthentication, deleteLocalProduct);

// Coupon Code Management
superadminRouter.post('/superadmin/create/coupon/code/v1', superadminAuthentication, createCouponCode);
superadminRouter.put('/superadmin/update/coupon/code/:id/v1', superadminAuthentication, updateCouponCode);
superadminRouter.delete('/superadmin/delete/coupon/code/:id/v1', superadminAuthentication, deleteCouponCode);
superadminRouter.get('/superadmin/list/coupon/code/v1', superadminAuthentication, listCouponCode);

// Premium Membership
superadminRouter.post('/superadmin/create/membership/v1', superadminAuthentication, createMembership);
superadminRouter.put('/superadmin/update/membership/:id/v1', superadminAuthentication, updateMembership);
superadminRouter.get('/user/membership/details/v1', userAuthentication, getMembershipDetails);

// User Management
superadminRouter.get('/superadmin/list/users/v1', superadminAuthentication, listUsers);
superadminRouter.get('/superadmin/user/details/:id/v1', superadminAuthentication, userDetails);
superadminRouter.post('/superadmin/user/inactice/:id/v1', superadminAuthentication, inActiveUserDetails);

// Payment Management
superadminRouter.get('/superadmin/payments/v1', superadminAuthentication, listPayments);
superadminRouter.get('/superadmin/payment/details/:id/v1', superadminAuthentication, paymentDetails);
superadminRouter.get('/superadmin/payment/configurations/v1', superadminAuthentication, getPaymentConfigurations);
superadminRouter.post('/superadmin/payment/configurations/v1', superadminAuthentication, savePaymentConfigurations);

// Order Management
superadminRouter.get('/superadmin/local-store/orders/v1', superadminAuthentication, listLocalStoreOrders);
superadminRouter.get('/superadmin/local-store/order/details/:id/v1', superadminAuthentication, localStoreOrderDetails);
superadminRouter.get('/superadmin/online/orders/v1', superadminAuthentication, listOnlineOrders);
superadminRouter.get('/superadmin/online/order/details/:id/v1', superadminAuthentication, onlineOrderDetails);

// Return Management
superadminRouter.get('/superadmin/online/return/v2', superadminAuthentication, getOnlineReturnOrder);
superadminRouter.get('/superadmin/online/return/details/:id/v2', superadminAuthentication, getReturnOrderDetails);
superadminRouter.put('/superadmin/online/return/changestatus/:id/v2', superadminAuthentication, returnAdminChangeStatus);

// Work Hours
superadminRouter.post('/superadmin/create/workhours/v1', superadminAuthentication, createWorkHours);
superadminRouter.get('/get/all/workhours/v1', getAllWorkHours);
superadminRouter.put('/superadmin/update/workhours/:id/v1', superadminAuthentication, updateWorkHours);
superadminRouter.delete('/superadmin/delete/workhours/:id/v1', superadminAuthentication, deleteWorkHours);

// Notifications
superadminRouter.post('/superadmin/notifications/v1', superadminAuthentication, createNotification);
superadminRouter.get('/superadmin/notifications/v1', superadminAuthentication, listNotifications);
superadminRouter.delete('/superadmin/notifications/:id/v1', superadminAuthentication, deleteNotification);

// Offers
superadminRouter.post('/superadmin/offers/v1', superadminAuthentication, createOffer);
superadminRouter.get('/superadmin/offers/v1', superadminAuthentication, listOffers);
superadminRouter.put('/superadmin/offers/:id/v1', superadminAuthentication, updateOffer);
superadminRouter.delete('/superadmin/offers/:id/v1', superadminAuthentication, deleteOffer);

// Welcome Image
superadminRouter.get('/superadmin/welcome-image/v1', superadminAuthentication, getWelcomeImage);
superadminRouter.post('/superadmin/welcome-image/v1', superadminAuthentication, uploadWelcomeImage);
superadminRouter.delete('/superadmin/welcome-image/v1', superadminAuthentication, deleteWelcomeImage);

// Popular Products
superadminRouter.post('/superadmin/store/:storeId/popular-products/v1', superadminAuthentication, saveStorePopularProducts);

export default superadminRouter;

