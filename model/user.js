const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    name: {
      type: String,
    },
    phone: {
      type: Number,
    },
    profilepic: {
      type: String,
    },
    token: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", userSchema)
