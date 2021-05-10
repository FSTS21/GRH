module.exports = (req, res, next) => {
    const personnels = require("./DB/personnels.json")
    const Personnel = require("../../models/personnel")
    const async = require("async")

    const specialFncs = require("../../config/specialFunctions")
    const avancementDao = require("../../Dao/avancementDao")
    const personneDao = require("../../Dao/personneDao")
    const mongoose = require("mongoose")

    async.series({
            findPersonne: callback => {

                personnels.forEach((p, key, arr) => {

                    personneDao.findByCIN(p.str_personne)
                        .orFail(() => {
                            throw new Error("can't find personne with code " + p.str_personne)
                        })
                        .then(result => {
                            if (result && Object.keys(result).length) {

                                if (!mongoose.Types.ObjectId.isValid(result._id))
                                    throw new Error(result._id + " Is not a valid ObjectId")

                                p.personne = result

                                if (key === arr.length - 1) // check if that is the last personnel
                                    callback(null, true)

                            }
                        })
                        .catch(function (err) {
                            console.log("error p : ", err)
                            callback(err)
                        })
                })
            },
            findAvancements: callback => {
                personnels.forEach((c, key, arr) => {
                    c.avancements = new Array
                    const arr_avancements = !c.str_avancements.trim() ? [] : c.str_avancements.split(";")
                    console.log("length : " + arr_avancements.length)

                    if (!arr_avancements.length) {
                        if (key === arr.length - 1) // check if that is the last personnel
                            callback(null, true)
                    } else {
                        specialFncs.trimmedData(arr_avancements).forEach(av => {
                            avancementDao.findByCode(av.trim())
                                .orFail(() => {
                                    throw new Error("can't find avancement with code " + av)
                                })
                                .then(result => {
                                    if (result && Object.keys(result).length) {

                                        if (!mongoose.Types.ObjectId.isValid(result._id))
                                            throw new Error(result._id + " Is not a valid ObjectId")

                                        c.avancements.push(result)
                                        console.log("push " + result._id)
                                        if (c.avancements.length == arr_avancements.length) {
                                            console.log("all avancements of this personnel was pushed")
                                            // return // equivalent of continue

                                            if (key === arr.length - 1) // check if that is the last personnel
                                                callback(null, true)
                                        }

                                    }

                                })

                                .catch(function (err) {
                                    console.log("error av : ", err)
                                    callback(err)
                                })
                        })
                    }
                });

            },
            insertPersonnels: function (callback) {
                console.log("insertPersonnels...")
                console.log("personnels => ", personnels)
                Personnel.insertMany(personnels, function (err) {
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
            if (err) {
                res.end("err : " + err)

            } else if (results.findAvancements && results.insertPersonnels && results.findPersonne) {
                console.log('New personnel: eg. ' + JSON.stringify(personnels[0]))
                res.end("insert personnels finished")
            }
        }
    )

}