const Personne = require("../models/personne")

exports.saveTempOne = (obj) => {
    // console.log("personneDao.saveOne => %s", obj)
    return obj.save()
}

exports.findByCIN = CIN => {
    return Personne.findOne({
        CIN : CIN
    })
}