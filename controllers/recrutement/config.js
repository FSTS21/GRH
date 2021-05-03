
exports.page = "admin/"

const personneConf = require("../../models/config/personneConf")
exports.initPage = {
    situations: personneConf.situations,
    // title: "Recrutement | GRH FST-Fés",
    title: "Recrutement"+ process.env.prefix_title,
    page_title: "Recrutement",
    sexes: personneConf.sexes,
    nationnalites: personneConf.nationnalites
}

