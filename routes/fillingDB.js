const express = require("express")
const router = express.Router()

router.get("/", (req, res, next) => {
    res.end('Filling Database...')
})
router.get("/avancements", require('../controllers/fillingDB/insertAvancements'))
router.get("/echelons", require('../controllers/fillingDB/insertEchelons'))
router.get("/cadres", require('../controllers/fillingDB/insertCadres'))
router.get("/grades", require('../controllers/fillingDB/insertGrades'))
router.get("/categories", require('../controllers/fillingDB/insertCategories'))
router.get("/personnel", require('../controllers/fillingDB/insertPersonnel'))

module.exports = router