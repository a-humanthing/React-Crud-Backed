const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Admin = require("../model/admin")

module.exports.adminRegister = async (req, res) => {
  const admin = await Admin(req.body)
  console.log(req.body)
  res.status(200).json({ success: true })
}

module.exports.adminLogin = async (req, res) => {
  const pass = "123"
  const name = "admin"
  console.log(req.body)
  const { username, password } = req.body
  if (username === name && password === pass) {
    const token = jwt.sign(
      {
        username,
      },
      "adminSecret",
      {
        expiresIn: "24h",
      }
    )
    const options = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    }
    return res.status(200).cookie("token", token, options).json({
      success: true,
      token,
      admin: true,
    })
  } else {
    return res.status(401).json({ success: false })
  }
}
