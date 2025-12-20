const Comment = require("./../models/commentModel");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

exports.setProductUserIds = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
});
exports.getTableComment = factory.getTable(Comment);
exports.getAllComments = factory.getAll(Comment);
exports.getComment = factory.getOne(Comment);
exports.createComment = factory.createOne(Comment);
exports.updateComment = factory.updateOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);
exports.isOwner = factory.checkPermission(Comment);
exports.likeComment = catchAsync(async (req, res, next) => {
  const data = await Comment.findById(req.params.id);
  if (!data) return next(new AppError("Không tìm thấy comment này", 404));
  
  const like = data.like || [];
  const userId = req.user.id.toString();
  
  // Kiểm tra xem user đã like chưa (so sánh ObjectId đúng cách)
  const userIndex = like.findIndex(
    (likeId) => likeId.toString() === userId
  );
  
  let result;
  if (userIndex === -1) {
    // Chưa like thì thêm vào
    result = [...like, req.user.id];
  } else {
    // Đã like thì xóa khỏi array (unlike)
    result = like.filter((likeId) => likeId.toString() !== userId);
  }
  
  data.like = result;
  await data.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    message: "Cập nhật like thành công",
    data: {
      data: data,
    },
  });
});
