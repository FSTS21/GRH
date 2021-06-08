const Cadre = require("../../models/cadre")
const i18n = require("i18n")

module.exports = [(req, res, next) => {
    res.locals.gradeConf = require("../../models/config/gradeConf")
    Cadre.find({})
        .populate({
            path: "grades",
            model: require("../../models/grade"),
            // select : "_id libelle"
            populate : {
                path : "echelons",
                model : require("../../models/echelon"),
                select : '_id indice titre'
            }
        })
        .lean({ virtuals: true })
        .exec()
        .then(results => {
            
            results.forEach(c => {
                c.grades.forEach(g => {
                    g.libelle_tr = i18n.__(g.libelle_tr)
                    
                })
            }) 
            console.log("cadres founded..",results)
            res.locals.formCadres = results
            next()
        })
}]