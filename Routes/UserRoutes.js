const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../Models/User.js");
const {protect}= require("../Middelware/authMiddelware.js")
const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "user Already exists with this email" });
    }
    user = new User({ name, email, password });
    await user.save();

    // create payload token
    const payload = { user: { id: user._id, role: user.role } };

    // sign in return the token along with user data

    jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;

        res.status(201).json({
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      },
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error");
  }
});

// route post /api/users/login
// checks authentucate user
// access public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // find the user by email
    let user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User does not exists with this email" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res
        .status(401)
        .json({ message: "Password is wrong please enter right password" });

    // create payload token
    const payload = { user: { id: user._id, role: user.role } };

    // sign in return the token along with user data

    jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;

        res.json({
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      },
    );
  } catch (error) {
    console.log(error);
     res.status(500).send("internal server error");
  }
});

//  route get for user profile api/user/profile
//  get logged in user profile
// data accces private

router.get("/profile",protect ,async (req,res)=>{
  res.json(req.user)

})


module.exports = router;
