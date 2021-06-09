const Personnel = require("../../models/personnel")

module.exports = [
    (req, res, next) => {
        Personnel.findById(req.params._id)
            .populate({
                path: "personne",
                model: require("../../models/personne")
            })
            .orFail(() => {
                console.log("Can't find it")
                throw new Error("Aucun personnel trouvé")
            })
            .then(result => {
                res.locals.personnel = result
                console.log("personnel : ", result.personne.nom)
                next()
            })
            .catch(err => {
                console.log('err => ', err)
                res.locals.result = err
                res.render("admin/personnel")
            })
    }
]