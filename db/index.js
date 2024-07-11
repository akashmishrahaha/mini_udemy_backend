const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://admin:170801AMI@cluster0.f5e9a05.mongodb.net/my-udemy-app"
);

// Define schemas
const AdminSchema = new mongoose.Schema({
  // Schema definition here
  username: String,
  password: String,
});

const UserSchema = new mongoose.Schema({
  // Schema definition here
  username: String,
  password: String,
});

const CourseSchema = new mongoose.Schema({
  // Schema definition here
  title: String,
  description: String,
  price: Number,
  imageLink: String,
});

const purchasedCourseSchema = new mongoose.Schema({
  userId: String,
  courseId: String,
  title: String,
  description: String,
  price: Number,
  imageLink: String,
});

const Admin = mongoose.model("Admin", AdminSchema);
const User = mongoose.model("User", UserSchema);
const Course = mongoose.model("Course", CourseSchema);
const PurchasedCourse = mongoose.model(
  "PurchasedCourse",
  purchasedCourseSchema
);
module.exports = {
  Admin,
  User,
  Course,
  PurchasedCourse,
};
