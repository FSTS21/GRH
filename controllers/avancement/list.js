// const mongoose = require("mongoose")
const Echelon = require("../../models/echelon")
const Cadre = require("../../models/cadre")
const Grade = require("../../models/grade")
const Avancement = require("../../models/avancement")
module.exports = (req, res, next) => {
    Cadre.find({})
        .populate({
            path: 'grades',
            model: Grade,
            populate: {
                path: 'echelons',
                model: Echelon,
                match: {
                    avancements: {
                        $not: {
                            $size: 0
                        }
                    }
                },
                populate: {
                    path: 'avancements',
                    model: Avancement,
                    /* match: {
                        type: "echelon"

                    } */
                }
            }
        })
        // .deepPopulate("grades grades.echelons")
        .then((results) => {
            // await results.populate("grades").execPopulate()

            // console.log(Cadre.populated("Grade"))
            res.locals.results = results
            results.forEach(cadre => {
                cadre.count = 0
                cadre.grades.forEach(g => {
                    g.count = 0
                    g.echelons.forEach(e => {
                        cadre.count = cadre.count + e.avancements.length
                        g.count = g.count + e.avancements.length
                    })
                })
            })

            let page = ""
            results.forEach(c => {
                c.grades.forEach(g => {
                    g.echelons.forEach(e => {
                        // if(e.avancements.length !== 0)
                        page = page + e + "\n"
                    })
                });

            })
            // res.end("reusults => " + page)
            res.render("admin/avancements")
        })
        .catch(err => {
            console.log("error : ", err)
        })
}