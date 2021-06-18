
exports.page = "admin/recrutement"

const personneConf = require("../../models/config/personneConf")
exports.initPage = {
    situations: personneConf.situations,
    title: "Recrutement"+ process.env.prefix_title,
    page_title: "Recrutement",
    sexes: personneConf.sexes,
    nationnalites: personneConf.nationnalites,
}

