module.exports = [
    require("../includes/loadEchelons"),
    (req, res, next) => {
        res.locals.page_title = "Informations personnels"
        res.locals.typesForm = require("../../models/config/avancementConf").types
        next()

    }
]