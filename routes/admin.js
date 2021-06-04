const express = require("express")
const router = express.Router()

router.get("/", require('../controllers/avancement/list'))
router.get("/recrutement", require('../controllers/recrutement/get'))
router.post("/recrutement", require('../controllers/recrutement/post'))
router.use("/recrutement", require('../controllers/recrutement/error'))
router.get("/avancements/:type", require('../controllers/avancement/list'))
router.get("/personnel/:_id", require('../controllers/personnel/get'))
router.post("/personnel/:_id", require('../controllers/personnel/post'))

module.exports = router