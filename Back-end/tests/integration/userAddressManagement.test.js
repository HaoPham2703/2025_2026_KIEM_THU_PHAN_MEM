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

describe("System Test - Flow User quản lý địa chỉ: Thêm --> Cập nhật --> Xóa", () => {
  let testUser;
  let testProduct;
  let testCategory;
  let testBrand;
  let authToken;
  let createdAddressId; // Index của địa chỉ

  beforeAll(async () => {
    // Tạo dữ liệu test
    testCategory = await Category.create({
      name: "Laptop Address Test",
      image: "https://example.com/category.jpg",
    });

    testBrand = await Brand.create({
      name: "Dell Address Test",
      image: "https://example.com/brand.jpg",
    });

    testProduct = await Product.create({
      title: "Dell Laptop Address Test Product",
      price: 15000000,
      inventory: 100,
      category: testCategory._id,
      brand: testBrand._id,
      images: ["https://example.com/laptop.jpg"],
    });

    testUser = await User.create({
      name: "Address Test User",
      email: "addresstest@example.com",
      password: "Haolatuii2703@",
      passwordConfirm: "Haolatuii2703@",
      role: "user",
      active: "active",
      address: [], // Khởi tạo mảng địa chỉ rỗng
    });
  });

  afterAll(async () => {
    await User.deleteMany({ email: "addresstest@example.com" });
    await Product.deleteMany({ title: "Dell Laptop Address Test Product" });
    await Order.deleteMany({ user: testUser._id });
    await Category.deleteMany({ name: "Laptop Address Test" });
    await Brand.deleteMany({ name: "Dell Address Test" });
  });

  describe("Bước 1: User đăng nhập", () => {
    beforeEach(async () => {
      // Xóa data cũ trước khi tạo mới
      await Category.deleteMany({ name: "Laptop Address Test" });
      await Brand.deleteMany({ name: "Dell Address Test" });
      await Product.deleteMany({ title: "Dell Laptop Address Test Product" });
      await User.deleteMany({ email: "addresstest@example.com" });
      await Order.deleteMany({});

      // Tạo lại data
      testCategory = await Category.create({
        name: "Laptop Address Test",
        image: "https://example.com/category.jpg",
      });

      testBrand = await Brand.create({
        name: "Dell Address Test",
        image: "https://example.com/brand.jpg",
      });

      testProduct = await Product.create({
        title: "Dell Laptop Address Test Product",
        price: 15000000,
        inventory: 100,
        category: testCategory._id,
        brand: testBrand._id,
        images: ["https://example.com/laptop.jpg"],
      });

      testUser = await User.create({
        name: "Address Test User",
        email: "addresstest@example.com",
        password: "Haolatuii2703@",
        passwordConfirm: "Haolatuii2703@",
        role: "user",
        active: "active",
        address: [], // Khởi tạo mảng địa chỉ rỗng
      });
    });

    it("nên đăng nhập thành công", async () => {
      const response = await request(app).post("/api/v1/users/login").send({
        email: "addresstest@example.com",
        password: "Haolatuii2703@",
      });

      expect(response.status).toBe(200);
      authToken = response.body.token;
    });
  });

  describe("Bước 2: User thêm địa chỉ mới", () => {
    beforeEach(async () => {
      // Xóa data cũ và tạo lại
      await Category.deleteMany({ name: "Laptop Address Test" });
      await Brand.deleteMany({ name: "Dell Address Test" });
      await Product.deleteMany({ title: "Dell Laptop Address Test Product" });
      await User.deleteMany({ email: "addresstest@example.com" });

      testCategory = await Category.create({
        name: "Laptop Address Test",
        image: "https://example.com/category.jpg",
      });

      testBrand = await Brand.create({
        name: "Dell Address Test",
        image: "https://example.com/brand.jpg",
      });

      testProduct = await Product.create({
        title: "Dell Laptop Address Test Product",
        price: 15000000,
        inventory: 100,
        category: testCategory._id,
        brand: testBrand._id,
        images: ["https://example.com/laptop.jpg"],
      });

      testUser = await User.create({
        name: "Address Test User",
        email: "addresstest@example.com",
        password: "Haolatuii2703@",
        passwordConfirm: "Haolatuii2703@",
        role: "user",
        active: "active",
        address: [],
      });

      // Đăng nhập
      authToken = (
        await request(app).post("/api/v1/users/login").send({
          email: "addresstest@example.com",
          password: "Haolatuii2703@",
        })
      ).body.token;
    });

    it("nên thêm địa chỉ mới thành công", async () => {
      const addressData = {
        name: "Address Test User",
        phone: "0123456789",
        province: "TP.HCM",
        district: "Quận 1",
        ward: "Phường Bến Nghé",
        detail: "123 Address Test Street",
      };

      const response = await request(app)
        .patch("/api/v1/users/createAddress")
        .set("Authorization", `Bearer ${authToken}`)
        .send(addressData);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");

      // Kiểm tra địa chỉ đã được thêm
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.address).toHaveLength(1);
      expect(updatedUser.address[0].name).toBe(addressData.name);
      expect(updatedUser.address[0].phone).toBe(addressData.phone);
      expect(updatedUser.address[0].setDefault).toBe(true); // Địa chỉ đầu tiên tự động là default

      createdAddressId = 0; // Index của địa chỉ
    });
  });

  describe("Bước 3: User xem danh sách địa chỉ", () => {
    beforeEach(async () => {
      // Xóa data cũ và tạo lại
      await Category.deleteMany({ name: "Laptop Address Test" });
      await Brand.deleteMany({ name: "Dell Address Test" });
      await Product.deleteMany({ title: "Dell Laptop Address Test Product" });
      await User.deleteMany({ email: "addresstest@example.com" });

      testCategory = await Category.create({
        name: "Laptop Address Test",
        image: "https://example.com/category.jpg",
      });

      testBrand = await Brand.create({
        name: "Dell Address Test",
        image: "https://example.com/brand.jpg",
      });

      testProduct = await Product.create({
        title: "Dell Laptop Address Test Product",
        price: 15000000,
        inventory: 100,
        category: testCategory._id,
        brand: testBrand._id,
        images: ["https://example.com/laptop.jpg"],
      });

      testUser = await User.create({
        name: "Address Test User",
        email: "addresstest@example.com",
        password: "Haolatuii2703@",
        passwordConfirm: "Haolatuii2703@",
        role: "user",
        active: "active",
        address: [],
      });

      // Đăng nhập và thêm địa chỉ
      authToken = (
        await request(app).post("/api/v1/users/login").send({
          email: "addresstest@example.com",
          password: "Haolatuii2703@",
        })
      ).body.token;

      // Thêm địa chỉ đầu tiên
      await request(app)
        .patch("/api/v1/users/createAddress")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Address Test User",
          phone: "0123456789",
          province: "TP.HCM",
          district: "Quận 1",
          ward: "Phường Bến Nghé",
          detail: "123 Address Test Street",
        });
    });

    it("nên xem được danh sách địa chỉ", async () => {
      const response = await request(app)
        .get("/api/v1/users/me/address")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data.address)).toBe(true);
      expect(response.body.data.address.length).toBeGreaterThan(0);
    });
  });

  describe("Bước 4: User thêm địa chỉ thứ 2", () => {
    beforeEach(async () => {
      // Xóa data cũ và tạo lại
      await Category.deleteMany({ name: "Laptop Address Test" });
      await Brand.deleteMany({ name: "Dell Address Test" });
      await Product.deleteMany({ title: "Dell Laptop Address Test Product" });
      await User.deleteMany({ email: "addresstest@example.com" });

      testCategory = await Category.create({
        name: "Laptop Address Test",
        image: "https://example.com/category.jpg",
      });

      testBrand = await Brand.create({
        name: "Dell Address Test",
        image: "https://example.com/brand.jpg",
      });

      testProduct = await Product.create({
        title: "Dell Laptop Address Test Product",
        price: 15000000,
        inventory: 100,
        category: testCategory._id,
        brand: testBrand._id,
        images: ["https://example.com/laptop.jpg"],
      });

      testUser = await User.create({
        name: "Address Test User",
        email: "addresstest@example.com",
        password: "Haolatuii2703@",
        passwordConfirm: "Haolatuii2703@",
        role: "user",
        active: "active",
        address: [],
      });

      authToken = (
        await request(app).post("/api/v1/users/login").send({
          email: "addresstest@example.com",
          password: "Haolatuii2703@",
        })
      ).body.token;

      // Thêm địa chỉ đầu tiên
      await request(app)
        .patch("/api/v1/users/createAddress")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Address Test User",
          phone: "0123456789",
          province: "TP.HCM",
          district: "Quận 1",
          ward: "Phường Bến Nghé",
          detail: "123 Address Test Street",
        });

      createdAddressId = 0;
    });

    it("nên thêm địa chỉ thứ 2 thành công", async () => {
      const addressData = {
        name: "Address Test User",
        phone: "0987654321",
        province: "TP.HCM",
        district: "Quận 2",
        ward: "Phường Thảo Điền",
        detail: "456 New Address Street",
      };

      const response = await request(app)
        .patch("/api/v1/users/createAddress")
        .set("Authorization", `Bearer ${authToken}`)
        .send(addressData);

      expect(response.status).toBe(200);

      // Kiểm tra địa chỉ mới đã được thêm
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser).toBeTruthy();
      expect(updatedUser.address).toBeDefined();
      expect(updatedUser.address).toHaveLength(2);
      expect(updatedUser.address[1].detail).toBe(addressData.detail);
      expect(updatedUser.address[1].setDefault).toBe(false); // Không phải default
    });
  });

  describe("Bước 5: User cập nhật địa chỉ", () => {
    beforeEach(async () => {
      // Xóa data cũ và tạo lại
      await Category.deleteMany({ name: "Laptop Address Test" });
      await Brand.deleteMany({ name: "Dell Address Test" });
      await Product.deleteMany({ title: "Dell Laptop Address Test Product" });
      await User.deleteMany({ email: "addresstest@example.com" });

      testCategory = await Category.create({
        name: "Laptop Address Test",
        image: "https://example.com/category.jpg",
      });

      testBrand = await Brand.create({
        name: "Dell Address Test",
        image: "https://example.com/brand.jpg",
      });

      testProduct = await Product.create({
        title: "Dell Laptop Address Test Product",
        price: 15000000,
        inventory: 100,
        category: testCategory._id,
        brand: testBrand._id,
        images: ["https://example.com/laptop.jpg"],
      });

      testUser = await User.create({
        name: "Address Test User",
        email: "addresstest@example.com",
        password: "Haolatuii2703@",
        passwordConfirm: "Haolatuii2703@",
        role: "user",
        active: "active",
        address: [],
      });

      authToken = (
        await request(app).post("/api/v1/users/login").send({
          email: "addresstest@example.com",
          password: "Haolatuii2703@",
        })
      ).body.token;

      // Thêm địa chỉ đầu tiên
      await request(app)
        .patch("/api/v1/users/createAddress")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Address Test User",
          phone: "0123456789",
          province: "TP.HCM",
          district: "Quận 1",
          ward: "Phường Bến Nghé",
          detail: "123 Address Test Street",
        });

      createdAddressId = 0;
    });

    it("nên cập nhật địa chỉ thành công", async () => {
      const updateData = {
        id: createdAddressId, // Index của địa chỉ
        name: "Updated Receiver",
        phone: "0111222333",
        province: "TP.HCM",
        district: "Quận 3",
        ward: "Phường Võ Thị Sáu",
        detail: "789 Updated Address Street",
        setDefault: true,
      };

      const response = await request(app)
        .patch("/api/v1/users/updateAddress")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);

      // Kiểm tra địa chỉ đã được cập nhật
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.address[createdAddressId].detail).toBe(
        updateData.detail
      );
      expect(updatedUser.address[createdAddressId].name).toBe(updateData.name);
    });
  });

  describe("Bước 6: User đặt địa chỉ mặc định", () => {
    beforeEach(async () => {
      // Xóa data cũ và tạo lại
      await Category.deleteMany({ name: "Laptop Address Test" });
      await Brand.deleteMany({ name: "Dell Address Test" });
      await Product.deleteMany({ title: "Dell Laptop Address Test Product" });
      await User.deleteMany({ email: "addresstest@example.com" });

      testCategory = await Category.create({
        name: "Laptop Address Test",
        image: "https://example.com/category.jpg",
      });

      testBrand = await Brand.create({
        name: "Dell Address Test",
        image: "https://example.com/brand.jpg",
      });

      testProduct = await Product.create({
        title: "Dell Laptop Address Test Product",
        price: 15000000,
        inventory: 100,
        category: testCategory._id,
        brand: testBrand._id,
        images: ["https://example.com/laptop.jpg"],
      });

      testUser = await User.create({
        name: "Address Test User",
        email: "addresstest@example.com",
        password: "Haolatuii2703@",
        passwordConfirm: "Haolatuii2703@",
        role: "user",
        active: "active",
        address: [],
      });

      authToken = (
        await request(app).post("/api/v1/users/login").send({
          email: "addresstest@example.com",
          password: "Haolatuii2703@",
        })
      ).body.token;

      // Thêm 2 địa chỉ
      await request(app)
        .patch("/api/v1/users/createAddress")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Address Test User",
          phone: "0123456789",
          province: "TP.HCM",
          district: "Quận 1",
          ward: "Phường Bến Nghé",
          detail: "123 Address Test Street",
        });

      await request(app)
        .patch("/api/v1/users/createAddress")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Address Test User",
          phone: "0987654321",
          province: "TP.HCM",
          district: "Quận 2",
          ward: "Phường Thảo Điền",
          detail: "456 New Address Street",
        });
    });

    it("nên đặt địa chỉ làm mặc định thành công", async () => {
      // Đặt địa chỉ thứ 2 (index 1) làm mặc định
      const response = await request(app)
        .patch("/api/v1/users/setDefaultAddress")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          id: 1, // Index của địa chỉ thứ 2
        });

      expect(response.status).toBe(200);

      // Kiểm tra địa chỉ đã được đặt làm mặc định
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser).toBeTruthy();
      expect(updatedUser.address).toBeDefined();
      expect(updatedUser.address.length).toBeGreaterThan(1);
      expect(updatedUser.address[1].setDefault).toBe(true);
      expect(updatedUser.address[0].setDefault).toBe(false); // Địa chỉ cũ không còn default
    });
  });

  describe("Bước 7: User tạo đơn hàng với địa chỉ đã lưu", () => {
    beforeEach(async () => {
      // Xóa data cũ và tạo lại
      await Category.deleteMany({ name: "Laptop Address Test" });
      await Brand.deleteMany({ name: "Dell Address Test" });
      await Product.deleteMany({ title: "Dell Laptop Address Test Product" });
      await User.deleteMany({ email: "addresstest@example.com" });
      await Order.deleteMany({});

      testCategory = await Category.create({
        name: "Laptop Address Test",
        image: "https://example.com/category.jpg",
      });

      testBrand = await Brand.create({
        name: "Dell Address Test",
        image: "https://example.com/brand.jpg",
      });

      testProduct = await Product.create({
        title: "Dell Laptop Address Test Product",
        price: 15000000,
        inventory: 100,
        category: testCategory._id,
        brand: testBrand._id,
        images: ["https://example.com/laptop.jpg"],
      });

      testUser = await User.create({
        name: "Address Test User",
        email: "addresstest@example.com",
        password: "Haolatuii2703@",
        passwordConfirm: "Haolatuii2703@",
        role: "user",
        active: "active",
        address: [],
      });

      authToken = (
        await request(app).post("/api/v1/users/login").send({
          email: "addresstest@example.com",
          password: "Haolatuii2703@",
        })
      ).body.token;

      // Thêm địa chỉ và set default
      await request(app)
        .patch("/api/v1/users/createAddress")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Address Test User",
          phone: "0123456789",
          province: "TP.HCM",
          district: "Quận 1",
          ward: "Phường Bến Nghé",
          detail: "123 Address Test Street",
        });

      await request(app)
        .patch("/api/v1/users/createAddress")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Address Test User",
          phone: "0987654321",
          province: "TP.HCM",
          district: "Quận 2",
          ward: "Phường Thảo Điền",
          detail: "456 New Address Street",
        });

      await request(app)
        .patch("/api/v1/users/setDefaultAddress")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ id: 1 });
    });

    it("nên tạo đơn hàng với địa chỉ đã lưu", async () => {
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser).toBeTruthy();
      expect(updatedUser.address).toBeDefined();
      const defaultAddress = updatedUser.address.find(
        (addr) => addr.setDefault === true
      );
      expect(defaultAddress).toBeDefined();

      // Tạo địa chỉ đầy đủ từ các field
      const fullAddress = `${defaultAddress.detail}, ${defaultAddress.ward}, ${defaultAddress.district}, ${defaultAddress.province}`;

      const orderData = {
        cart: [
          {
            id: testProduct._id.toString(),
            product: {
              _id: testProduct._id.toString(),
              title: testProduct.title,
              price: testProduct.price,
              images: testProduct.images,
            },
            quantity: 1,
          },
        ],
        address: fullAddress,
        receiver: defaultAddress.name,
        phone: defaultAddress.phone,
        payments: "tiền mặt",
        totalPrice: 15000000,
      };

      const response = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body.data.id).toBeDefined();

      // Kiểm tra đơn hàng sử dụng địa chỉ đã lưu
      const createdOrder = await Order.findById(response.body.data.id);
      expect(createdOrder.address).toBe(fullAddress);
      expect(createdOrder.receiver).toBe(defaultAddress.name);
    });
  });

  describe("Bước 8: User xóa địa chỉ", () => {
    beforeEach(async () => {
      // Xóa data cũ và tạo lại
      await Category.deleteMany({ name: "Laptop Address Test" });
      await Brand.deleteMany({ name: "Dell Address Test" });
      await Product.deleteMany({ title: "Dell Laptop Address Test Product" });
      await User.deleteMany({ email: "addresstest@example.com" });

      testCategory = await Category.create({
        name: "Laptop Address Test",
        image: "https://example.com/category.jpg",
      });

      testBrand = await Brand.create({
        name: "Dell Address Test",
        image: "https://example.com/brand.jpg",
      });

      testProduct = await Product.create({
        title: "Dell Laptop Address Test Product",
        price: 15000000,
        inventory: 100,
        category: testCategory._id,
        brand: testBrand._id,
        images: ["https://example.com/laptop.jpg"],
      });

      testUser = await User.create({
        name: "Address Test User",
        email: "addresstest@example.com",
        password: "Haolatuii2703@",
        passwordConfirm: "Haolatuii2703@",
        role: "user",
        active: "active",
        address: [],
      });

      authToken = (
        await request(app).post("/api/v1/users/login").send({
          email: "addresstest@example.com",
          password: "Haolatuii2703@",
        })
      ).body.token;

      // Thêm 2 địa chỉ
      await request(app)
        .patch("/api/v1/users/createAddress")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Address Test User",
          phone: "0123456789",
          province: "TP.HCM",
          district: "Quận 1",
          ward: "Phường Bến Nghé",
          detail: "123 Address Test Street",
        });

      await request(app)
        .patch("/api/v1/users/createAddress")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Address Test User",
          phone: "0987654321",
          province: "TP.HCM",
          district: "Quận 2",
          ward: "Phường Thảo Điền",
          detail: "456 New Address Street",
        });
    });

    it("nên xóa địa chỉ thành công", async () => {
      const response = await request(app)
        .patch("/api/v1/users/deleteAddress")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          id: 1, // Index của địa chỉ thứ 2
        });

      expect(response.status).toBe(200);

      // Kiểm tra địa chỉ đã bị xóa
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.address.length).toBe(1); // Còn 1 địa chỉ
      // Địa chỉ còn lại tự động trở thành default
      expect(updatedUser.address[0].setDefault).toBe(true);
    });
  });

  describe("Flow hoàn chỉnh: Thêm --> Cập nhật --> Xóa --> Tạo đơn", () => {
    it("nên thực hiện toàn bộ flow quản lý địa chỉ", async () => {
      // Xóa data cũ và tạo lại
      await Category.deleteMany({ name: "Laptop Address Test" });
      await Brand.deleteMany({ name: "Dell Address Test" });
      await Product.deleteMany({ title: "Dell Laptop Address Test Product" });
      await User.deleteMany({ email: "addresstest@example.com" });
      await Order.deleteMany({});

      const testCategory = await Category.create({
        name: "Laptop Address Test",
        image: "https://example.com/category.jpg",
      });

      const testBrand = await Brand.create({
        name: "Dell Address Test",
        image: "https://example.com/brand.jpg",
      });

      const testProduct = await Product.create({
        title: "Dell Laptop Address Test Product",
        price: 15000000,
        inventory: 100,
        category: testCategory._id,
        brand: testBrand._id,
        images: ["https://example.com/laptop.jpg"],
      });

      const testUser = await User.create({
        name: "Address Test User",
        email: "addresstest@example.com",
        password: "Haolatuii2703@",
        passwordConfirm: "Haolatuii2703@",
        role: "user",
        active: "active",
        address: [],
      });

      const authToken = (
        await request(app).post("/api/v1/users/login").send({
          email: "addresstest@example.com",
          password: "Haolatuii2703@",
        })
      ).body.token;
      // Thêm địa chỉ
      const addResponse = await request(app)
        .patch("/api/v1/users/createAddress")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Complete Flow User",
          phone: "0999888777",
          province: "TP.HCM",
          district: "Quận 5",
          ward: "Phường 1",
          detail: "999 Complete Flow Address",
        });

      expect(addResponse.status).toBe(200);

      expect(addResponse.status).toBe(200);

      // Lấy user để lấy index
      const user = await User.findById(testUser._id);
      expect(user).toBeTruthy();
      expect(user.address).toBeDefined();
      expect(user.address.length).toBeGreaterThan(0);
      const addressIndex = user.address.length - 1;

      // Cập nhật địa chỉ
      const updateResponse = await request(app)
        .patch("/api/v1/users/updateAddress")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          id: addressIndex,
          name: "Complete Flow User",
          phone: "0999888777",
          province: "TP.HCM",
          district: "Quận 5",
          ward: "Phường 1",
          detail: "888 Updated Complete Flow",
          setDefault: true,
        });

      expect(updateResponse.status).toBe(200);

      // Tạo đơn hàng với địa chỉ
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser).toBeTruthy();
      expect(updatedUser.address).toBeDefined();
      const defaultAddr = updatedUser.address.find(
        (addr) => addr.setDefault === true
      );
      expect(defaultAddr).toBeDefined();
      const fullAddress = `${defaultAddr.detail}, ${defaultAddr.ward}, ${defaultAddr.district}, ${defaultAddr.province}`;

      const orderData = {
        cart: [
          {
            id: testProduct._id.toString(),
            product: {
              _id: testProduct._id.toString(),
              title: testProduct.title,
              price: testProduct.price,
              images: testProduct.images,
            },
            quantity: 1,
          },
        ],
        address: fullAddress,
        receiver: defaultAddr.name,
        phone: defaultAddr.phone,
        payments: "tiền mặt",
        totalPrice: 15000000,
      };

      const orderResponse = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(orderData);

      expect(orderResponse.status).toBe(201);
      expect(orderResponse.body.data).toBeDefined();
    });
  });
});
