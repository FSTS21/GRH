module.exports = (req, res, next) => {
    const grades = require("./DB/grades.json")
    const Grade = require("../../models/grade")
    const async = require("async")

    const specialFncs = require("../../config/specialFunctions")
    const echelonDao = require("../../Dao/echelonDao")
    const mongoose = require("mongoose")

    async.series({
            findEchelons: callback => {
                grades.forEach((c, key, arr) => {
                    c.echelons = new Array
                    const arr_echelons = !c.str_echelons.trim() ? [] : c.str_echelons.split(";")
                    if (!arr_echelons.length) {
                        console.log("key : " + key + "  | Empty array")
                        if (key === arr.length - 1) // check if that is the last grade
                            callback(null, true)
                    } else {
                        specialFncs.trimmedData(arr_echelons).forEach(ech => {
                            echelonDao.findByCode(ech.trim())
                                .orFail(() => {
                                    throw new Error("can't find echelon with code " + ech)
                                })
                                .then(result => {
                                    if (result && Object.keys(result).length) {

                                        if (!mongoose.Types.ObjectId.isValid(result._id))
                                            throw new Error(result._id + " Is not a valid ObjectId")

                                        c.echelons.push(result)
                                        console.log("push " + result._id + " from " + ech.trim())
                                        if (c.echelons.length == arr_echelons.length) {
                                            console.log("all echelons of this grade was pushed")
                                            // return // equivalent of continue

                                            if (key === arr.length - 1) // check if that is the last grade
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
            insertGrades: function (callback) {
                console.log("insertGrades...")
                console.log("grades => ", grades)
                Grade.insertMany(grades, function (err) {
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
            } else if (results.findEchelons && results.insertGrades) {
                console.log('New grade: eg. ' + JSON.stringify(grades[0]))
                res.end("insert grades finished")
            }
        }
    )

}