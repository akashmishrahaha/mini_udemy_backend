const zod = require("zod");
const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const { Admin } = require("../db");
const { Course } = require("../db");
const jwt = require("jsonwebtoken");
const jwtPassword = "12345";
// Admin Routes
router.post("/signup", (req, res) => {
  // Implement admin signup logic
  const { username, password } = req.headers;
  const newAdmin = new Admin({
    username: username,
    password: password,
  });
  newAdmin
    .save()
    .then(() => res.status(201).send("Admin created successfully"))
    .catch((err) => res.status(500).send("Error creating admin"));
});

router.post("/signin", async (req, res) => {
  // Implement admin signup logic
  try {
    const { username, password } = req.headers;
    const myAdminuser = await Admin.findOne({ username, password });
    console.log(myAdminuser);
    if (myAdminuser) {
      let token = jwt.sign({ username: username }, jwtPassword);
      res.status(200).json({ token });
    } else {
      return res.status(403).send("Signin authentication failed");
    }
  } catch (err) {
    res.status(500).send("Internal server error");
  }
});

router.post("/courses", adminMiddleware, (req, res) => {
  // Implement course creation logic
  const schema = zod.object({
    title: zod.string(),
    description: zod.string(),
    price: zod.number().max(1000),
    imageLink: zod.string(),
  });

  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }
  const courseInfo = result.data;

  let newCourse = new Course({
    title: courseInfo.title,
    description: courseInfo.description,
    price: courseInfo.price,
    imageLink: courseInfo.imageLink,
  });

  newCourse
    .save()
    .then(() => {
      res
        .status(200)
        .send("Successfully saved course info" + "course id " + newCourse._id);
      newCourse._id = 1;
    })
    .catch((err) => {
      res.status(404).json({ err: "Unable to add course" });
    });
});

router.get("/courses", adminMiddleware, async (req, res) => {
  try {
    const adminCourses = await Course.find();
    const formattedCourses = adminCourses.map((course, index) => ({
      id: index + 1,
      title: course.title,
      description: course.description,
      price: course.price,
      imageLink: course.imageLink,
    }));
    res.status(200).json({ courses: formattedCourses });
  } catch (err) {
    res.status(500).json({ err: "Error fetching courses" });
  }
});

module.exports = router;
