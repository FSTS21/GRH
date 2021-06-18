module.exports = (req, res, next) => {
    const categories = require("./DB/categories.json")
    const Categorie = require("../../models/categorie")
    const async = require("async")

    const specialFncs = require("../../config/specialFunctions")
    const cadreDao = require("../../Dao/cadreDao")
    const mongoose = require("mongoose")

    const withCadres = categories.filter(e => e.str_cadres.trim())

    async.series({
            findCadres: callback => {
                let count = 0
                withCadres.forEach((c, key, arr) => {
                    c.cadres = new Array
                    const arr_cadres = c.str_cadres.split(";")

                    specialFncs.trimmedData(arr_cadres).forEach(av => {
                        cadreDao.findByCode(av.trim())
                            .orFail(() => {
                                throw new Error("can't find cadre with code " + av)
                            })
                            .then(result => {
                                if (result && Object.keys(result).length) {

                                    if (!mongoose.Types.ObjectId.isValid(result._id))
                                        throw new Error(result._id + " Is not a valid ObjectId")

                                    c.cadres.push(result)
                                    console.log("push " + result._id)
                                    if (c.cadres.length == arr_cadres.length) {
                                        console.log("all cadres of this categorie was pushed")
                                        // return // equivalent of continue

                                        count++
                                        if (count === arr.length) // check if that is the last echelon
                                            callback(null, true)
                                    }

                                }

                            })

                            .catch(function (err) {
                                console.log("error av : ", err)
                                callback(err)
                            })
                    })
                });

            },
            insertCategories: function (callback) {
                console.log("insertCategories...")
                console.log("categories => ", categories)
                Categorie.insertMany(categories, function (err) {
                    if (err) {
                        console.log("err : ", err)
                        callback(err);
                    } else
                        callback(null, true);
                });
            }
        },

        function (err, results) {
            console.log("finish the insertions.")
            console.log(results.findcadres + " - " + results.insertCategories)
            if (err) {
                res.end("err : " + err)

            } else if (results.findCadres && results.insertCategories) {
                console.log('New categorie: eg. ' + JSON.stringify(categories[0]))
                res.end("insert categories finished")
            }
        }
    )

}