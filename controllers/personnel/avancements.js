const Personnel = require("../../models/personnel")

module.exports = [
    (req, res, next) => {
        Personnel.findById(req.params._id)
            .populate({
                path: "avancements",
                model: require("../../models/avancement"),
                options: {
                    sort: {
                        dateEffet: -1
                    }
                }
            })
            .orFail(() => {
                console.log("Can't find it")
                throw new Error("Aucun personnel trouvé")
            })
            .then((result) => {
                res.locals.personnel.avancements = result.avancements
                next()
            })
            .catch(err => {
                console.log('err => ', err)
                res.locals.result = err
                res.render("admin/personnel")
            })
    },

    (req, res, next) => {
        res.locals.cadres.forEach(c => {
            c.grades.forEach(g => {
                g.echelons.forEach(e => {
                    e.avancements.forEach(a => {
                        res.locals.personnel.avancements.forEach(p_av => {
                            if (p_av._id.equals(a)) {
                                p_av.cadre = c
                                p_av.grade = g
                                p_av.echelon = e
                            }
                        })
                    })
                })
            })
        })

        next()
    }
]