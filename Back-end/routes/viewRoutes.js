const express = require("express");
// const AppError = require("./../utils/appError");
// const catchAsync = require("./../utils/catchAsync");
// const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const viewController = require("../controllers/viewController");
const Order = require("../models/orderModel");
const Import = require("../models/importModel");
const passport = require("../utils/passport");

const router = express.Router();
router.use(authController.isLoggedIn);

router.get("/login", viewController.alreadyLoggedIn, (req, res, next) => {
  res.status(200).render("login", { title: "Login" });
});

router.get("/signup", viewController.alreadyLoggedIn, (req, res, next) => {
  res.status(200).render("signup", { title: "Đăng ký Admin" });
});
// router.get(
//   "/google",
//   passport.authenticate("google", {
//     session: false,
//     scope: ["email", "profile"],
//     accessType: "offline",
//     approvalPrompt: "force"
//   })
// );
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     session: false,
//     failureRedirect: "/login",
//   }),
//   viewController.googleLogin
// );
// router.get("/google/callback", passport.authenticate("google"), (req, res) => {
//   res.redirect("/");
// });
router.use(viewController.errorPage);
router.get("/", (req, res, next) => {
  res.status(200).render("dashboard", { title: "Bảng Điều Khiển" });
});
router.get("/analytics", (req, res, next) => {
  res.status(200).render("analytic", { title: "Analytics" });
});
router.get("/users", (req, res, next) => {
  res.status(200).render("user", { title: "Manage User" });
});
router.get("/products", (req, res, next) => {
  res.status(200).render("product", { title: "Quản Lý Sản Phẩm" });
});
router.get("/orders", (req, res, next) => {
  res.status(200).render("order", { title: "Manage Order" });
});
// Helper function để format số tiền
function formatCurrency(amount) {
  return Number(amount).toLocaleString("vi-VN");
}

router.get("/orders/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await Order.findById(id);
    let total = 0;
    data.cart.forEach((value) => {
      total += value.product.price * value.quantity;
      // Format giá sản phẩm
      value.product.formattedPrice = formatCurrency(value.product.price);
    });
    data.total = total;
    // Format các giá tiền
    data.formattedTotal = formatCurrency(total);
    data.formattedDiscount = formatCurrency(total - data.totalPrice);
    data.formattedTotalPrice = formatCurrency(data.totalPrice);
    const theDate = new Date(Date.parse(data.createdAt));
    const date = theDate.toLocaleString();
    data.date = date;
    data.discount = total - data.totalPrice;
    res.status(200).render("orderDetail", { data, title: "Chi Tiết Đơn Hàng" });
  } catch (error) {
    res.status(200).render("404");
  }
});
router.get("/imports", (req, res, next) => {
  res.status(200).render("import", { title: "Manage Import" });
});
router.get("/imports/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await Import.findById(id);
    const theDate = new Date(Date.parse(data.createdAt));
    const date = theDate.toLocaleString();
    data.date = date;
    res.status(200).render("importDetail", { data, title: "Import Detail" });
  } catch (error) {
    res.status(200).render("404");
  }
});
router.get("/brands", (req, res, next) => {
  res.status(200).render("brand", { title: "Manage Brand" });
});
router.get("/categories", (req, res, next) => {
  res.status(200).render("category", { title: "Manage Category" });
});
router.get("/reviews", (req, res, next) => {
  res.status(200).render("review", { title: "Manage Review" });
});
router.get("/locations", (req, res, next) => {
  res.status(200).render("location", { title: "Quản lý kho" });
});

module.exports = router;
