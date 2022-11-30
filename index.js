const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")

const userRoutes = require("./routes/user")
const adminRoutes = require("./routes/admin")
const app = express()
const port = 5000

mongoose.connect("mongodb://0.0.0.0:27017/firstReact")

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => {
  console.log("Database connected")
})

app.use(cookieParser())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use("/", userRoutes)
app.use("/admin", adminRoutes)
app.get("/", (req, res) => {
  res.send("Hello express")
})

app.all("*", (req, res) => {
  res.send("404 Not found")
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
