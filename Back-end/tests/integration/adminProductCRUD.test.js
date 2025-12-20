const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Category = require("../../models/categoryModel");
const Brand = require("../../models/brandModel");
const sendEmail = require("../../utils/email");

// Mock email module
jest.mock("../../utils/email");
sendEmail.mockResolvedValue(true);

describe("System Test - Flow Admin quản lý sản phẩm: Tạo --> Cập nhật --> Xóa", () => {
  let adminUser;
  let testCategory;
  let testBrand;
  let adminToken;
  let createdProductId;

  beforeAll(async () => {
    // Tạo admin user
    adminUser = await User.create({
      name: "Admin Product CRUD Test",
      email: "adminproductcrud@example.com",
      password: "Haolatui2703@",
      passwordConfirm: "Haolatui2703@",
      role: "admin",
      active: "active",
    });

    // Tạo category và brand
    testCategory = await Category.create({
      name: "Laptop Product CRUD Test",
      image: "https://example.com/category.jpg",
    });

    testBrand = await Brand.create({
      name: "Dell Product CRUD Test",
      image: "https://example.com/brand.jpg",
    });
  });

  afterAll(async () => {
    await User.deleteMany({ email: "adminproductcrud@example.com" });
    await Product.deleteMany({ title: /Product CRUD Test/ });
    await Category.deleteMany({ name: "Laptop Product CRUD Test" });
    await Brand.deleteMany({ name: "Dell Product CRUD Test" });
  });

  describe("Bước 1: Admin đăng nhập", () => {
    it("nên đăng nhập admin thành công", async () => {
      const response = await request(app).post("/api/v1/users/login").send({
        email: "adminproductcrud@example.com",
        password: "Haolatui2703@",
      });

      expect(response.status).toBe(200);
      adminToken = response.body.token;
    });
  });

  describe("Bước 2: Admin tạo sản phẩm mới", () => {
    it("nên tạo sản phẩm mới thành công", async () => {
      const productData = {
        title: "New Product CRUD Test",
        price: 20000000,
        inventory: 50,
        category: testCategory._id.toString(),
        brand: testBrand._id.toString(),
        images: ["https://example.com/newproduct.jpg"],
        description: "Sản phẩm mới từ CRUD test",
      };

      const response = await request(app)
        .post("/api/v1/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("success");
      expect(response.body.data.data.title).toBe("New Product CRUD Test");

      createdProductId = response.body.data.data._id;

      // Kiểm tra sản phẩm được tạo trong database
      const createdProduct = await Product.findById(createdProductId);
      expect(createdProduct).toBeTruthy();
      expect(createdProduct.price).toBe(20000000);
      expect(createdProduct.inventory).toBe(50);
    });
  });

  describe("Bước 3: Admin cập nhật sản phẩm", () => {
    it("nên cập nhật sản phẩm thành công", async () => {
      const updateData = {
        title: "Updated Product CRUD Test",
        price: 25000000,
        inventory: 75,
      };

      const response = await request(app)
        .patch(`/api/v1/products/${createdProductId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");

      // Kiểm tra sản phẩm đã được cập nhật
      const updatedProduct = await Product.findById(createdProductId);
      expect(updatedProduct).toBeTruthy();
      expect(updatedProduct.title).toBe("Updated Product CRUD Test");
      expect(updatedProduct.price).toBe(25000000);
      expect(updatedProduct.inventory).toBe(75);
    });

    it("nên cập nhật một phần thông tin sản phẩm", async () => {
      const partialUpdate = {
        price: 22000000,
      };

      const response = await request(app)
        .patch(`/api/v1/products/${createdProductId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(partialUpdate);

      expect(response.status).toBe(200);

      const updatedProduct = await Product.findById(createdProductId);
      expect(updatedProduct).toBeTruthy();
      expect(updatedProduct.price).toBe(22000000);
      // Các field khác không thay đổi
      expect(updatedProduct.title).toBe("Updated Product CRUD Test");
    });
  });

  describe("Bước 4: Admin xóa sản phẩm", () => {
    it("nên xóa sản phẩm thành công", async () => {
      const response = await request(app)
        .delete(`/api/v1/products/${createdProductId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(204);

      // Kiểm tra sản phẩm đã bị xóa
      const deletedProduct = await Product.findById(createdProductId);
      expect(deletedProduct).toBeNull();
    });
  });

  describe("Flow hoàn chỉnh: Tạo --> Cập nhật --> Xóa", () => {
    it("nên thực hiện toàn bộ flow CRUD sản phẩm", async () => {
      // Tạo sản phẩm
      const productData = {
        title: "Complete CRUD Flow Product",
        price: 30000000,
        inventory: 100,
        category: testCategory._id.toString(),
        brand: testBrand._id.toString(),
        images: ["https://example.com/complete.jpg"],
      };

      const createResponse = await request(app)
        .post("/api/v1/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(productData);

      expect(createResponse.body.data).toBeDefined();
      expect(createResponse.body.data.data).toBeDefined();
      const productId = createResponse.body.data.data._id;

      // Cập nhật sản phẩm
      await request(app)
        .patch(`/api/v1/products/${productId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          price: 35000000,
          inventory: 120,
        });

      // Kiểm tra đã cập nhật
      const updatedProduct = await Product.findById(productId);
      expect(updatedProduct).toBeTruthy();
      expect(updatedProduct.price).toBe(35000000);
      expect(updatedProduct.inventory).toBe(120);

      // Xóa sản phẩm
      await request(app)
        .delete(`/api/v1/products/${productId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      // Kiểm tra đã xóa
      const deletedProduct = await Product.findById(productId);
      expect(deletedProduct).toBeNull();
    });
  });
});
