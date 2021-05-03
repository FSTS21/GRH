const express = require("express")
const router = express.Router()

router.get("/", require('../controllers/recrutement/get'))
router.post("/", require('../controllers/recrutement/post'))
router.use("/", require('../controllers/recrutement/error'))

module.exports = router