const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRECT_KEY = "abcdefghijklmnop";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Not Valid Email");
      }
    },
  },
  password: {
    type: String,
    //required: true,
    //minlength: 6
  },
  affiliateLink: {
    type: String,
  }, 
  confirmed: {
    type: Boolean,
    default: false,
  },
  // tokens: [
  //     {
  //         token: {
  //             type: String,
  //             required: true,
  //         }
  //     }
  // ]
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log("---------", enteredPassword, this.password);
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
    console.log('pre----------')
  if (!this.isModified("password")) {
    console.log('pre------------1')
    next();
  }
  const salt = await bcrypt.genSalt(10);
  console.log('pre------------3', salt, this.password)
  this.password = await bcrypt.hash(this.password, salt);
  console.log('pre------------4', salt, this.password)
});

// token generate
userSchema.methods.generateAuthtoken = async function () {
  try {
    let newtoken = jwt.sign({ _id: this._id }, SECRECT_KEY, {
      expiresIn: "1d",
    });

    this.tokens = this.tokens.concat({ token: newtoken });
    await this.save();
    return newtoken;
  } catch (error) {
    res.status(400).json(error);
  }
};

// creating model
const users = new mongoose.model("users", userSchema);

module.exports = users;
