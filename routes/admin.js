const express = require("express")
const router = express.Router()

router.get("/", require('../controllers/avancement/list'))

router.get("/recrutement", require('../controllers/recrutement/get'))
router.get("/recrutement/:personne", require('../controllers/recrutement/get_2'))
router.post("/recrutement", require('../controllers/recrutement/post'))
router.post("/recrutement/:personne", require('../controllers/recrutement/post_2'))
router.use("/recrutement", require('../controllers/recrutement/error'))

router.get("/avancements/:type", require('../controllers/avancement/list'))
router.get("/personnel/:_id", require('../controllers/personnel/get'))
router.post("/personnel/:_id", require('../controllers/personnel/post'))

module.exports = router