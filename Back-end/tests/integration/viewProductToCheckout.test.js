const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Order = require("../../models/orderModel");
const Category = require("../../models/categoryModel");
const Brand = require("../../models/brandModel");
const sendEmail = require("../../utils/email");

// Mock email module
jest.mock("../../utils/email");
sendEmail.mockResolvedValue(true);

describe("System Test - Flow Xem sản phẩm --> Thêm vào giỏ --> Thanh toán", () => {
  let testUser;
  let testProducts;
  let testCategory;
  let testBrand;
  let authToken;

  beforeAll(async () => {
    // Tạo dữ liệu test
    testCategory = await Category.create({
      name: "Laptop View Test",
      image: "https://example.com/category.jpg",
    });

    testBrand = await Brand.create({
      name: "Dell View Test",
      image: "https://example.com/brand.jpg",
    });

    // Tạo nhiều sản phẩm để test xem danh sách
    testProducts = await Product.create([
      {
        title: "Dell Laptop View Test Product 1",
        price: 15000000,
        inventory: 100,
        category: testCategory._id,
        brand: testBrand._id,
        images: ["https://example.com/laptop1.jpg"],
      },
      {
        title: "Dell Laptop View Test Product 2",
        price: 20000000,
        inventory: 50,
        category: testCategory._id,
        brand: testBrand._id,
        images: ["https://example.com/laptop2.jpg"],
      },
    ]);

    testUser = await User.create({
      name: "View Test User",
      email: "viewtest@example.com",
      password: "Haolatui2703@",
      passwordConfirm: "Haolatui2703@",
      role: "user",
      active: "active",
    });
  });

  afterAll(async () => {
    await User.deleteMany({ email: "viewtest@example.com" });
    await Product.deleteMany({ title: /Dell Laptop View Test Product/ });
    await Order.deleteMany({ user: testUser._id });
    await Category.deleteMany({ name: "Laptop View Test" });
    await Brand.deleteMany({ name: "Dell View Test" });
  });

  describe("Bước 1: Đăng nhập", () => {
    it("nên đăng nhập thành công", async () => {
      const response = await request(app).post("/api/v1/users/login").send({
        email: "viewtest@example.com",
        password: "Haolatui2703@",
      });

      expect(response.status).toBe(200);
      authToken = response.body.token;
    });
  });

  describe("Bước 2: Xem danh sách sản phẩm", () => {
    it("nên xem được danh sách sản phẩm", async () => {
      const response = await request(app)
        .get("/api/v1/products")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
      expect(response.body.data.data).toBeDefined();
      expect(Array.isArray(response.body.data.data)).toBe(true);
      // Note: Products có thể rỗng nếu chưa có data, nhưng test expect có data
      // Nếu test fail ở đây, cần kiểm tra xem products có được tạo đúng trong beforeAll không
      if (response.body.data.data.length === 0) {
        console.warn(
          "Warning: Products array is empty. Check beforeAll setup."
        );
      }
      expect(response.body.data.data.length).toBeGreaterThan(0);
    });

    it("nên filter sản phẩm theo category", async () => {
      const response = await request(app)
        .get(`/api/v1/products?category=${testCategory._id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      const products = response.body.data.data;
      products.forEach((product) => {
        expect(product.category._id.toString()).toBe(
          testCategory._id.toString()
        );
      });
    });
  });

  describe("Bước 3: Xem chi tiết sản phẩm", () => {
    it("nên xem được chi tiết sản phẩm", async () => {
      const response = await request(app)
        .get(`/api/v1/products/${testProducts[0]._id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
      expect(response.body.data.data).toBeDefined();
      expect(response.body.data.data._id.toString()).toBe(
        testProducts[0]._id.toString()
      );
      expect(response.body.data.data.title).toBe(
        "Dell Laptop View Test Product 1"
      );
      expect(response.body.data.data.price).toBe(15000000);
    });
  });

  describe("Bước 4: Tạo đơn hàng (giả lập thêm vào giỏ)", () => {
    it("nên tạo đơn hàng với sản phẩm đã xem", async () => {
      const orderData = {
        cart: [
          {
            id: testProducts[0]._id.toString(),
            product: {
              _id: testProducts[0]._id.toString(),
              title: testProducts[0].title,
              price: testProducts[0].price,
              images: testProducts[0].images,
            },
            quantity: 1,
          },
        ],
        address: "123 View Test Street",
        receiver: "View Test User",
        phone: "0123456789",
        payments: "tiền mặt",
        totalPrice: 15000000,
      };

      const response = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body.data.id).toBeDefined();
    });
  });

  describe("Flow hoàn chỉnh: Xem --> Chọn --> Mua", () => {
    it("nên thực hiện toàn bộ flow từ xem sản phẩm đến thanh toán", async () => {
      // Bước 1: Xem danh sách
      const listResponse = await request(app)
        .get("/api/v1/products")
        .set("Authorization", `Bearer ${authToken}`);

      expect(listResponse.status).toBe(200);
      expect(listResponse.body.data).toBeDefined();
      expect(listResponse.body.data.data).toBeDefined();
      const products = listResponse.body.data.data;
      expect(Array.isArray(products)).toBe(true);
      // Note: Products có thể rỗng nếu chưa có data
      if (products.length === 0) {
        console.warn(
          "Warning: Products array is empty. Check beforeAll setup."
        );
      }
      expect(products.length).toBeGreaterThan(0);

      // Bước 2: Xem chi tiết sản phẩm đầu tiên
      const firstProduct = products[0];
      const detailResponse = await request(app)
        .get(`/api/v1/products/${firstProduct._id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(detailResponse.status).toBe(200);

      // Bước 3: Tạo đơn hàng
      const orderData = {
        cart: [
          {
            id: firstProduct._id.toString(),
            product: {
              _id: firstProduct._id.toString(),
              title: firstProduct.title,
              price: firstProduct.price,
              images: firstProduct.images || [],
            },
            quantity: 1,
          },
        ],
        address: "999 Complete View Flow",
        receiver: "Complete View User",
        phone: "0111222333",
        payments: "tiền mặt",
        totalPrice: firstProduct.price,
      };

      const orderResponse = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(orderData);

      expect(orderResponse.status).toBe(201);
    });
  });
});
