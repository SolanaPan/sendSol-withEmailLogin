const users = require("../models/userSchema");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken.js");
const bcrypt = require("bcryptjs");

exports.userRegister = async (req, res) => {
  console.log("=============", req.body);
  const { email, affiliateLink } = req.body;
  const password = "";
  console.log("email----", email);
  if (!email) {
    res.status(400).json({ error: "Please Enter All Input Data" });
  }

  try {
    console.log("---------------");
    const presuer = await users.findOne({ email: email });
    console.log("presuer", presuer);
    if (presuer) {
      res.status(400).json({ error: "User already exists" });
    } else {
      const userregister = new users({
        email,
        password,
        affiliateLink
      });
      console.log("userregister", userregister);
      // here password hasing
      try {
        const storeData = await userregister.save();
        console.log("storeData--------", storeData);
      } catch (err) {
        console.log("SaveError:", err);
      }

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL, // your email
          pass: process.env.PASSWORD, // email pass, put them in .env file & turn the 'Less secure apps' option 'on' in gmail settings
        },
      });
      console.log("transport---", transporter);
      console.log("------id---", userregister._id);
      const token = jwt.sign(
        { email: userregister.email },
        process.env.EMAIL_SECRET,
        {
          expiresIn: "1d",
        }
      );
      const url = `${process.env.PROD_SERVER}/api/users/verification/${token}`;
      console.log("url---", url);
      const emailSent = await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Email verification to complete your registration!",
        text: "Email Verification",
        html: `<p>Please click this link to verify yourself. <a href="${url}">${url}</a></p>`,
      });
      console.log("emailSent: ", emailSent);
      if (emailSent) {
        const date = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        }).format(new Date());

        res.status(201).json({
          status: "Registration successful!",
          message: `An email was sent to ${email} at ${date}. Please check your email for verification.`,
        });
      } else {
        res
          .status(400)
          .json({ error: "Registration failed, Email sending failed!" });
      }
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid Details", error });
  }
};

exports.userLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!password || !email) {
    res.status(400).json({ error: "Please Enter Your Password and email" });
  }

  try {
    const user = await users.findOne({ email: email });
    if (user) {
      if (await user.matchPassword(password))
        if (user.confirmed) {
          res.status(200).json({
            email: user.email,
            token: generateToken(user._id),
            affiliateLink: user.affiliateLink
          });
        } else {
          res
            .status(400)
            .json({ error: "Please check you email and verify yourself!" });
        }
      else {
        res.status(400).json({ error: "Invalid Password" });
      }
    } else {
      console.log("ErrorTeyp: 403##");
      res.status(400).json({ error: "User not exist" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid Details", error });
  }
};

exports.userEmailVerify = async (req, res) => {
  try {
    const { email } = jwt.verify(req.params.token, process.env.EMAIL_SECRET);

    if (email) {
      const updatedUser = await users.findOneAndUpdate(
        { email: email },
        { confirmed: true }
      );
      if (updatedUser) {
        return res.redirect(
          `${process.env.PROD_CLIENT}/setpassword/${req.params.token}`
        );
      } else {
        res.status(404).json({ error: "User not found!" });
      }
    } else {
      res.status(404).json({ error: "Invalid token or request!" });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid token or request!" });
  }
};

exports.userSetPassword = async (req, res) => {
  try {
    console.log("-------------------------------", req.body);
    const { token, password } = req.body.info;
    console.log("token----", token);
    console.log("password----", password);
    const { email } = jwt.verify(token, process.env.EMAIL_SECRET);
    console.log("email----", email);

    if (email) {
      const salt = await bcrypt.genSalt(10);
      console.log("setoassword------------3", salt, password);
      let password1 = await bcrypt.hash(password, salt);
      console.log("setoassword------------4", password1);
      const updatedUser = await users.findOneAndUpdate(
        { email: email },
        { password: password1 }
      );
      if (updatedUser) {
        console.log("123123123123123");
        //return res.redirect(`${process.env.PROD_CLIENT}/`);
        res.status(200).send({ message: "success" });
      } else {
        console.log("456456456");
        res.status(404).json({ error: "User not found" });
      }
    } else {
      res.status(404).json({ error: "Invalid token or request!" });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid token or request!" });
  }
};
