const express = require("express")
const { model } = require("mongoose")
const { adminLogin } = require("../controller/admin")
const router = express.Router()

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
router.post("/login", adminLogin)

module.exports = router
