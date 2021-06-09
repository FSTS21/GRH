// const mongoose = require("mongoose")
const Echelon = require("../../models/echelon")
const Cadre = require("../../models/cadre")
const Grade = require("../../models/grade")
const Avancement = require("../../models/avancement")
const avancementConf = require("../../models/config/avancementConf")
const Personnel = require("../../models/personnel")
const Personne = require("../../models/personne")


module.exports = [
    (req, res, next) => {
        if (req.params.type == "grade") {
            res.locals.match = {
                $or: [{
                    type: "grade"
                },{
                    type: "recrutement"
                }]
            }
        } else {
            console.log(avancementConf.types[req.params.type] + " != " + avancementConf.types.grade)
            req.params.type = "Tous"
            res.locals.match = {}
        }


        res.locals.page_title = "Avancement (" + req.params.type + ")";
        console.log("avancementConf : ", avancementConf)
        res.locals.avancementConf = avancementConf.types

        next()
    },
    (req, res, next) => {
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
                        match: res.locals.match
                    }
                }
            })
            .sort({
                libelle: 1
            })
            .then((results) => {

                res.locals.allAvancements = results

                /* let page = ""
                results.forEach(c => {
                    c.grades.forEach(g => {
                        g.echelons.forEach(e => {
                            // if(e.avancements.length !== 0)
                            page = page + e + "\n"
                        })
                    });

                }) */

                next()
            })
            .catch(err => {
                console.log("error : ", err)
            })
    }, (req, res, next) => {



        /* personnelEx = new Personnel
        personnelEx.SOM = "165164"
        personnelEx.avancements = [
            {
                code : 5,
                dateEffet : 
            },

        ] */

        Personnel.find({}).populate({
                    path: 'avancements',
                    model: Avancement,
                    match: res.locals.match,
                    options: {
                        sort: {
                            dateEffet: -1
                        }
                    }
                }

            )
            .populate({
                path: "personne",
                model: Personne
            })
            .then(results => {
                results.forEach(p => {
                    p.lastAv = p.avancements[0]
                })
                res.locals.lastAvs = results.filter(r => r.avancements.length > 0)
                next()
            })
            .catch(
                err => {
                    console.log("err : ", err)
                }
            )

    }, (req, res, next) => {
        // console.log("lastAvs = ",res.locals.lastAvs)
        res.locals.allAvancements.forEach(c => {
            c.count = 0
            c.grades.forEach(g => {
                g.count = 0
                g.echelons.forEach(e => {
                    e.count = 0
                    e.avancements.forEach(a => {
                        a.personnel = res.locals.lastAvs.filter(this_p => {
                            // console.log("this_p.lastAv => ",this_p)
                            return this_p.lastAv.code == a.code
                        })[0]
                        if (a.personnel) {
                            c.count++
                            g.count++
                            e.count++
                        }
                    })
                    e.avancements = e.avancements.filter(this_a => this_a.personnel)
                })
            });

        })

        /* results.forEach(cadre => {
            cadre.count = 0
            cadre.grades.forEach(g => {
                g.count = 0
                g.echelons.forEach(e => {
                    cadre.count = cadre.count + e.avancements.length
                    g.count = g.count + e.avancements.length
                })
            })
        }) */

        // res.end("reusults => " + page)

        console.log("type : ", res.locals.match)
        res.render("admin/avancements")

    }
]