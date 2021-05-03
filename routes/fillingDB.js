const express = require("express")
const router = express.Router()

router.get("/", (req, res, next) => {
    res.end('Filling Database...')
})
router.get("/cadres", require('../controllers/fillingDB/insertCadres'))
router.get("/avancements", require('../controllers/fillingDB/insertAvancements'))
router.get("/echelons", require('../controllers/fillingDB/insertEchelons'))
router.get("/test", require('../controllers/fillingDB/insertTest'))

module.exports = router