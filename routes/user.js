const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User } = require("../db");
const { Course } = require("../db");
const { PurchasedCourse } = require("../db");
const { title } = require("process");
const { describe } = require("node:test");
const jwt = require("jsonwebtoken");
const jwtPassword = "12345";

// User Routes
router.post("/signup", (req, res) => {
  // Implement user signup logic
  const { username, password } = req.headers;

  const newUser = new User({
    username: username,
    password: password,
  });
  newUser
    .save()
    .then(() => {
      res.status(200).json({ msg: "User added successfullly" });
    })
    .catch((err) => {
      res.status(403).json({ err: "Auth failed" });
    });
});

router.post("/signin", async (req, res) => {
  // Implement admin signup logic
  const { username, password } = req.headers;
  const userdata = await User.findOne({
    username: username,
    password: password,
  });
  if (userdata) {
    let token = jwt.sign({ username: username }, jwtPassword);
    res.status(200).json({ token });
  } else {
    res.status(400).json({ msg: "Error signing in" });
  }
});

router.get("/courses", async (req, res) => {
  // Implement listing all courses logic
  try {
    const allCourses = await Course.find();
    const formattedCourses = allCourses.map((course, index) => ({
      id: index + 1,
      title: course.title,
      description: course.description,
      price: course.price,
      imageLink: course.imageLink,
      published: true,
    }));

    // Send the formatted courses as the response
    res.json(formattedCourses);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: "An error occurred while fetching courses" });
  }
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  // Implement course purchase logic
  const courseId = req.params.courseId;
  const user = req.user;

  try {
    const course = await Course.findById(courseId);
    console.log(course);

    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }
    // Checking if he already purchased
    // Implement additional logic for purchasing the course here

    // Checking if the user already purchased the course
    const alreadyPurchased = await PurchasedCourse.findOne({
      userId: user._id,
      courseId,
    });

    console.log(alreadyPurchased);

    if (alreadyPurchased) {
      return res.status(400).json({ msg: "Course already purchased" });
    }
    const newPurchase = new PurchasedCourse({
      userId: user._id,
      courseId: courseId,
      title: course.title,
      description: course.description,
      price: course.price,
      imageLink: course.imageLink,
    });

    await newPurchase.save();
    return res.status(200).json({ msg: "Course purchased successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "An error occurred while processing your request" });
  }
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  // Implement fetching purchased courses logic
  try {
    const mypurchasedCourses = await PurchasedCourse.find();

    const formattedPurchasedCourse = mypurchasedCourses.map(
      (course, index) => ({
        id: index + 1,
        title: course.title,
        description: course.description,
        price: course.price,
        imageLink: course.imageLink,
      })
    );

    res.status(200).json({ formattedPurchasedCourse });
    //
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
