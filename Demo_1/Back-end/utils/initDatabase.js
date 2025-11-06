const mongoose = require("mongoose");

/**
 * Khởi tạo database và collections
 * Import tất cả models để đảm bảo MongoDB tạo collections khi cần
 */
const initDatabase = async () => {
  try {
    // Import tất cả các models để đảm bảo schemas được đăng ký
    // Điều này đảm bảo MongoDB sẽ tạo collections khi có document được insert
    require("../models/userModel");
    require("../models/productModel");
    require("../models/categoryModel");
    require("../models/brandModel");
    require("../models/orderModel");
    require("../models/reviewModel");
    require("../models/commentModel");
    require("../models/importModel");
    require("../models/transactionModel");
    require("../models/locationModel");

    // Lấy danh sách collections hiện có
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((col) => col.name);

    // Danh sách collections mong đợi
    const expectedCollections = [
      "users",
      "products",
      "categories",
      "brands",
      "orders",
      "reviews",
      "comments",
      "imports",
      "transactions",
      "locations",
    ];

    console.log("\n📊 Database Collections Status:");
    console.log("─".repeat(50));

    // Kiểm tra và tạo collections nếu chưa tồn tại
    for (const collectionName of expectedCollections) {
      try {
        if (collectionNames.includes(collectionName)) {
          const count = await db.collection(collectionName).countDocuments();
          console.log(`  ✅ ${collectionName.padEnd(20)} - ${count} documents`);
        } else {
          // Tạo collection nếu chưa tồn tại
          // MongoDB sẽ tự động tạo collection khi có document đầu tiên,
          // nhưng việc tạo sẵn giúp đảm bảo collections được tạo ngay
          await db.createCollection(collectionName);
          console.log(
            `  🆕 ${collectionName.padEnd(20)} - Created (0 documents)`
          );
        }
      } catch (err) {
        // Nếu collection đã tồn tại hoặc có lỗi khác, bỏ qua
        if (err.code === 48) {
          // Error code 48 = NamespaceExists (collection đã tồn tại)
          const count = await db.collection(collectionName).countDocuments();
          console.log(`  ✅ ${collectionName.padEnd(20)} - ${count} documents`);
        } else {
          console.log(`  ⚠️  ${collectionName.padEnd(20)} - ${err.message}`);
        }
      }
    }

    // Đồng bộ indexes từ schemas (Mongoose sẽ tự động tạo indexes từ schema)
    try {
      await mongoose.connection.syncIndexes();
      console.log("  📑 Indexes synchronized");
    } catch (err) {
      // Bỏ qua lỗi sync indexes nếu có (indexes sẽ được tạo khi cần)
      console.log("  ⚠️  Index sync skipped (will be created automatically)");
    }

    console.log("─".repeat(50));
    console.log("✅ Database initialization completed!\n");
  } catch (error) {
    console.error("❌ Error initializing database:", error.message);
    // Không throw error để server vẫn có thể chạy
  }
};

module.exports = initDatabase;
