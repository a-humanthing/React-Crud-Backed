const mongoose = require("mongoose")
const Schema = mongoose.Schema

const adminSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    cpassword: String,
  },
  { timestamps: true }
)
module.exports = mongoose.model("Admin", adminSchema)
