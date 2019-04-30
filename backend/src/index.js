const express = require("express");
const port = require("./config/index");
const cors = require("cors");
const User = require("./model/user");
const Task = require("./model/task");
const multer = require("multer");
const sharp = require("sharp");
require("./config/mongoose");

const app = express();
app.use(cors());
app.use(express.json());

//register
app.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(200).send(user);
  } catch (e) {
    res.status(400).send(e.message);
    // console.log(e);
  }
});

//login
app.post("/users/login", async (req, res) => {
  // Login user
  const { email, password } = req.body; // destruct property

  try {
    const user = await User.findByCredentials(email, password); // Function buatan sendiri, di folder models file user.js
    res.status(200).send(user);
  } catch (e) {
    res.status(404).send(e);
  }
});

//add task
app.post("/tasks/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new Error("error");
    }
    const task = await new Task({ ...req.body, owner: user._id });
    user.tasks = await user.tasks.concat(task._id);
    task.save();
    user.save();
    res.send(task);
  } catch (e) {
    res.send(e);
  }
});

//show task
app.get("/tasks/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId })
      .populate({
        path: "tasks",
        // match: { completed: false },
        options: { sort: { completed: false }, limit: 5 }
      })
      .exec();
    res.send(user.tasks);
  } catch (e) {}
});

//delete task
app.delete("/tasks", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.body.taskid });
    const user = await User.findOne({ _id: req.body.owner });

    if (!task) {
      return res.status(404).send("Delete failed");
    }

    user.tasks = await user.tasks.filter(val => val != req.body.taskid);
    user.save();
    console.log(user.tasks);

    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

//edit task
app.patch("/tasks/:taskid/:userid", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ err: "Invalid request!" });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.taskid,
      owner: req.params.userid
    });

    if (!task) {
      return res.status(404).send("Update Request");
    }

    updates.forEach(update => (task[update] = req.body[update]));
    await task.save();

    res.send("update berhasil");
  } catch (e) {}
});

//add avatar
const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("unable to upload"));
    }
    cb(undefined, cb);
  }
});
app.post("/users/:userId/avatar", upload.single("avatar"), async (req, res) => {
  try {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250 })
      .png()
      .toBuffer();
    const user = await User.findById(req.params.userId);

    if (!user) {
      throw new Error("Unable to upload");
    }

    user.avatar = buffer;
    await user.save();
    // res.set("Content-Type", "image/png");

    // res.send(user.avatar);
    res.send("Upload Success !");

    await app.get("/users/:userId/avatar", async (req, res) => {
      try {
        const user = await User.findById(req.params.userId);
        if (!user) {
          throw new Error("not found");
        }
        res.set("Content-Type", "image/png");
        res.send(user.avatar);
      } catch (e) {
        res.send(e);
      }
    });
  } catch (e) {
    res.send(e);
  }
});

//show avatar
app.get("/users/:userId/avatar/:ea", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new Error("not found");
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
    res.render("index.html");
  } catch (e) {
    res.send(e);
  }
});

//delete avatar
app.delete("/avatar/:userId", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      {
        _id: req.params.userId
      },
      { $set: { avatar: "" } }
    );
    res.send(user);
  } catch (e) {
    console.log();
  }
});

//delete user
app.delete("/users/:userId/delete", async (req, res) => {
  const { userId } = req.params;

  try {
    await User.findOneAndDelete({ _id: userId });
    await Task.deleteMany({ owner: userId });

    // task.save();

    res.send("success");
  } catch (e) {}
});

//edit user
app.patch("/users/:userId", async (req, res) => {
  console.log(req.body);

  const { password } = req.body;
  if (password === "") {
    var updates = Object.keys(req.body);
    var allowedUpdates = ["name", "age", "email"];
    var isValidOperation = updates.every(update =>
      allowedUpdates.includes(update)
    );
  } else {
    var updates = Object.keys(req.body);
    var allowedUpdates = ["name", "age", "email", "password"];
    var isValidOperation = updates.every(update =>
      allowedUpdates.includes(update)
    );
  }

  if (!isValidOperation) {
    return res.status(400).send({ err: "Invalid request!" });
  }

  try {
    const user = await User.findOne({
      _id: req.params.userId
    });

    if (!user) {
      return res.status(404).send("Update Request");
    }

    updates.forEach(update => (user[update] = req.body[update]));
    await user.save();

    res.send(user);
  } catch (e) {}
});

// app.patch("/avatar/:userId", async (req, res) => {
//   console.log(req.body);

//   const updates = Object.keys(req.body);
//   const allowedUpdates = ["avatar"];
//   const isValidOperation = updates.every(update =>
//     allowedUpdates.includes(update)
//   );

//   if (!isValidOperation) {
//     return res.status(400).send({ err: "Invalid request!" });
//   }

//   try {
//     const user = await User.findOne({
//       _id: req.params.userId
//     });

//     if (!user) {
//       return res.status(404).send("Update Request");
//     }

//     updates.forEach(update => (user[update] = req.body[update]));
//     await user.save();

//     res.send(user);
//   } catch (e) {}
// });

// app.get("/users/:userId", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId);
//     if (!user) {
//       throw new Error("not found");
//     }
//     res.send(user.updatedAt);
//   } catch (e) {
//     res.send(e);
//   }
// });

app.listen(port, () => {
  console.log("API running on port", port);
});
