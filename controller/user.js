const { v4 } = require("uuid")
const user = require("../model/user")
const User = require("../model/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const cookieParser = require("cookie-parser")
module.exports.getUsers = async (req, res, next) => {
  jwt.verify(req.token, "adminSecret", async (err, authorizedData) => {
    if (err) {
      console.log("jwt admin verification error = ", err)
      res.status(403).json({ success: false })
    } else {
      console.log("admin auth success with data = ", authorizedData)
      const users = await User.find({})
      res.status(200).json({ success: true, users })
    }
  })
}
module.exports.createUser = async (req, res) => {
  try {
    const { password, name, email, phone } = req.body
    const hashedPass = await bcrypt.hash(password, 10)
    const addUser = await User.create({
      name: name,
      email: email,
      phone: phone,
      password: hashedPass,
    })
    addUser.save()
    res.send("User added")
  } catch (error) {
    console.log("DB error")
  }
}

module.exports.showUser = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)
    res.send(user)
  } catch (error) {
    res.send(error)
  }
}

module.exports.editUser = async (req, res) => {
  try {
    const { id } = req.params
    const { user } = await User.findByIdAndUpdate(id, { ...req.body })
    res.send("updated")
  } catch (error) {
    res.send(error)
  }
}

module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    const { user } = await User.findByIdAndDelete(id)
    res.send("deleted")
  } catch (error) {
    res.send(error)
  }
}

module.exports.userRegister = async (req, res) => {
  try {
    console.log(req.body)
    const { email, password, phone, name } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(401).json({ success: false })
    } else {
      //password hashing
      const hashedPass = await bcrypt.hash(password, 10)
      //save user to DB
      const user = await User.create({
        name: name,
        email: email,
        password: hashedPass,
        phone: phone,
      })
      await user.save()
      //generate a token for user and send it
      const token = jwt.sign(
        {
          id: user._id,
          email,
        },
        "secret123", //proece.env.jwtsecret
        { expiresIn: "24h" }
      )
      user.token = token
      user.password = undefined
      return res.status(200).json(user)
    }
  } catch (error) {
    console.log("register error = ", error)
    res.status(401).json({ success: false })
  }
}

module.exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    //match password

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        {
          id: user._id,
          email,
        },
        "secret123", //proece.env.jwtsecret
        { expiresIn: "24h" }
      )
      user.token = token
      user.password = undefined

      //send token in user cookie
      const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }
      return res.status(200).cookie("token", token, options).json({
        success: true,
        token,
        id: user._id,
        name: user.name,
      })
    } else {
      return res.status(401).json({ success: false })
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports.sendUserData = async (req, res, next) => {
  jwt.verify(req.token, "secret123", async (err, authorizedData) => {
    if (err) {
      console.log("jwt verification error = ", err)
      res.status(403).json({ success: false })
    } else {
      const id = authorizedData.id
      const user = await User.findById(id)
      user.password = undefined
      res.status(200).json({ success: true, user })
    }
  })
}

module.exports.uploadPic = async (req, res, next) => {
  const { id, url } = req.body
  const user = await User.findByIdAndUpdate(id, { profilepic: url })
  res.status(200).json({ success: true, user })
}
