const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Import = require("../../models/importModel");
const Location = require("../../models/locationModel");
const Category = require("../../models/categoryModel");
const Brand = require("../../models/brandModel");
const sendEmail = require("../../utils/email");

// Mock email module
jest.mock("../../utils/email");
sendEmail.mockResolvedValue(true);

describe("System Test - Flow Admin: Nhập hàng --> Tạo sản phẩm --> Quản lý kho", () => {
  let adminUser;
  let testProduct;
  let testCategory;
  let testBrand;
  let testLocation;
  let adminToken;
  let initialInventory;

  beforeAll(async () => {
    // Tạo admin user
    adminUser = await User.create({
      name: "Admin Import Test",
      email: "adminimport@example.com",
      password: "Haolatuii2703@",
      passwordConfirm: "Haolatuii2703@",
      role: "admin",
      active: "active",
    });

    // Tạo location (kho)
    testLocation = await Location.create({
      name: "Kho Import Test",
      address: "123 Import Test Street",
      phone: "0123456789",
    });

    // Tạo category và brand
    testCategory = await Category.create({
      name: "Laptop Import Test",
      image: "https://example.com/category.jpg",
    });

    testBrand = await Brand.create({
      name: "Dell Import Test",
      image: "https://example.com/brand.jpg",
    });

    // Tạo sản phẩm test
    testProduct = await Product.create({
      title: "Dell Laptop Import Test Product",
      price: 15000000,
      inventory: 50,
      category: testCategory._id,
      brand: testBrand._id,
      images: ["https://example.com/laptop.jpg"],
    });

    initialInventory = testProduct.inventory;
  });

  afterAll(async () => {
    await User.deleteMany({ email: "adminimport@example.com" });
    await Product.deleteMany({ title: "Dell Laptop Import Test Product" });
    await Import.deleteMany({ location: testLocation._id });
    await Location.deleteMany({ name: "Kho Import Test" });
    await Category.deleteMany({ name: "Laptop Import Test" });
    await Brand.deleteMany({ name: "Dell Import Test" });
  });

  describe("Bước 1: Admin đăng nhập", () => {
    it("nên đăng nhập admin thành công", async () => {
      const response = await request(app).post("/api/v1/users/login").send({
        email: "adminimport@example.com",
        password: "Haolatuii2703@",
      });

      expect(response.status).toBe(200);
      adminToken = response.body.token;
    });
  });

  describe("Bước 2: Admin tạo import (nhập hàng)", () => {
    it("nên tạo import thành công và tăng inventory", async () => {
      const importData = {
        location: testLocation._id.toString(),
        invoice: [
          {
            product: testProduct._id.toString(),
            quantity: 20,
            price: 12000000, // Giá nhập
          },
        ],
        totalPrice: 240000000, // 20 x 12 triệu
      };

      const response = await request(app)
        .post("/api/v1/imports")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(importData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("success");

      // Kiểm tra import được tạo
      const createdImport = await Import.findOne({
        location: testLocation._id,
      });
      expect(createdImport).toBeTruthy();
      expect(createdImport.invoice).toHaveLength(1);
      expect(createdImport.totalPrice).toBe(240000000);
    });

    it("nên tăng inventory sản phẩm sau khi nhập hàng", async () => {
      const updatedProduct = await Product.findById(testProduct._id);
      expect(updatedProduct).toBeTruthy();
      // Inventory ban đầu: 50, nhập thêm: 20 => tổng: 70
      expect(updatedProduct.inventory).toBe(initialInventory + 20);
    });
  });

  describe("Bước 3: Admin tạo sản phẩm mới", () => {
    it("nên tạo sản phẩm mới thành công", async () => {
      const productData = {
        title: "New Product From Import Test",
        price: 20000000,
        inventory: 30,
        category: testCategory._id.toString(),
        brand: testBrand._id.toString(),
        images: ["https://example.com/newproduct.jpg"],
        description: "Sản phẩm mới từ import test",
      };

      const response = await request(app)
        .post("/api/v1/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("success");

      // Kiểm tra sản phẩm được tạo
      const createdProduct = await Product.findOne({
        title: "New Product From Import Test",
      });
      expect(createdProduct).toBeTruthy();
      expect(createdProduct.inventory).toBe(30);
    });
  });

  describe("Bước 4: Admin nhập hàng cho sản phẩm mới", () => {
    it("nên nhập hàng cho sản phẩm mới và tăng inventory", async () => {
      const newProduct = await Product.findOne({
        title: "New Product From Import Test",
      });
      expect(newProduct).toBeTruthy();

      const importData = {
        location: testLocation._id.toString(),
        invoice: [
          {
            product: newProduct._id.toString(),
            quantity: 50,
            price: 18000000,
          },
        ],
        totalPrice: 900000000,
      };

      const response = await request(app)
        .post("/api/v1/imports")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(importData);

      expect(response.status).toBe(201);

      // Kiểm tra inventory tăng
      const updatedProduct = await Product.findById(newProduct._id);
      expect(updatedProduct).toBeTruthy();
      expect(updatedProduct.inventory).toBe(30 + 50); // 80
    });
  });

  describe("Flow hoàn chỉnh: Tạo sản phẩm --> Nhập hàng --> Quản lý kho", () => {
    it("nên thực hiện toàn bộ flow quản lý kho", async () => {
      // Bước 1: Tạo sản phẩm mới
      const productData = {
        title: "Complete Flow Product",
        price: 25000000,
        inventory: 10,
        category: testCategory._id.toString(),
        brand: testBrand._id.toString(),
        images: ["https://example.com/complete.jpg"],
      };

      const productResponse = await request(app)
        .post("/api/v1/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(productData);

      expect(productResponse.body.data).toBeDefined();
      expect(productResponse.body.data.data).toBeDefined();
      const productId = productResponse.body.data.data._id;

      // Bước 2: Nhập hàng
      const importData = {
        location: testLocation._id.toString(),
        invoice: [
          {
            product: productId,
            quantity: 100,
            price: 20000000,
          },
        ],
        totalPrice: 2000000000,
      };

      const importResponse = await request(app)
        .post("/api/v1/imports")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(importData);

      expect(importResponse.status).toBe(201);

      // Bước 3: Kiểm tra inventory
      const finalProduct = await Product.findById(productId);
      expect(finalProduct).toBeTruthy();
      expect(finalProduct.inventory).toBe(10 + 100); // 110

      // Cleanup
      await Product.deleteMany({ title: "Complete Flow Product" });
      await Import.deleteMany({ location: testLocation._id });
    });
  });
});
