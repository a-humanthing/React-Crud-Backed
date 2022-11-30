const express = require("express")

const userController = require("../controller/user")

const router = express.Router()

const checkToken = (req, res, next) => {
  const header = req.headers["authorization"]

  if (typeof header !== "undefined") {
    const bearer = header.split(" ")
    const token = bearer[1]

    req.token = token
    next()
  } else {
    //If header is undefined return Forbidden (403)
    return res.status(403).json({ success: false })
  }
}

const checkAdminToken = (req, res, next) => {
  const header = req.headers["authorization"]

  if (typeof header !== "undefined") {
    const bearer = header.split(" ")
    const token = bearer[1]

    req.token = token
    next()
  } else {
    //If header is undefined return Forbidden (403)
    return res.status(403).json({ success: false })
  }
}

router.get("/users", checkAdminToken, userController.getUsers)
router.post("/user", userController.createUser)
router.get("/user/:id", userController.showUser)
router.put("/user/:id", userController.editUser)
router.delete("/user/:id", userController.deleteUser)
router.post("/user/register", userController.userRegister)
router.post("/user/login", userController.userLogin)
router.get("/profile", checkToken, userController.sendUserData)
router.post("/uploadpic", userController.uploadPic)

module.exports = router
