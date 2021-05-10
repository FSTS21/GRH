module.exports = (req, res, next) => {
    const echelons = require("./DB/echelons.json")
    const Echelon = require("../../models/echelon")
    const async = require("async")

    const specialFncs = require("../../config/specialFunctions")
    const avancementDao = require("../../Dao/avancementDao")
    const mongoose = require("mongoose")

    async.series({
            findAvancements: callback => {
                echelons.forEach((c, key, arr) => {
                    c.avancements = new Array
                    const arr_avancements = !c.str_avancements.trim() ? [] : c.str_avancements.split(";")
                    console.log("length : " + arr_avancements.length)

                    if (!arr_avancements.length) {
                        if (key === arr.length - 1) // check if that is the last echelon
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
                                            console.log("all avancements of this echelon was pushed")
                                            // return // equivalent of continue

                                            if (key === arr.length - 1) // check if that is the last echelon
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
            insertEchelons: function (callback) {
                console.log("insertEchelons...")
                console.log("echelons => ", echelons)
                Echelon.insertMany(echelons, function (err) {
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

            } else if (results.findAvancements && results.insertEchelons) {
                console.log('New echelon: eg. ' + JSON.stringify(echelons[0]))
                res.end("insert echelons finished")
            }
        }
    )

}