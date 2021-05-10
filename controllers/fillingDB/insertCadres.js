module.exports = (req, res, next) => {
    const cadres = require("./DB/cadres.json")
    const Cadre = require("../../models/cadre")
    const async = require("async")

    const specialFncs = require("../../config/specialFunctions")
    const gradeDao = require("../../Dao/gradeDao")
    const mongoose = require("mongoose")

    async.series({
            findGrades: callback => {
                cadres.forEach((c, key, arr) => {
                    c.grades = new Array
                    const arr_grades = !c.str_grades.trim() ? [] : c.str_grades.split(";")
                    console.log("length : " + arr_grades.length)

                    if (!arr_grades.length) {
                        if (key === arr.length - 1) // check if that is the last cadre
                            callback(null, true)
                    } else {
                        specialFncs.trimmedData(arr_grades).forEach(av => {
                            gradeDao.findByCode(av.trim())
                                .orFail(() => {
                                    throw new Error("can't find grade with code " + av)
                                })
                                .then(result => {
                                    if (result && Object.keys(result).length) {

                                        if (!mongoose.Types.ObjectId.isValid(result._id))
                                            throw new Error(result._id + " Is not a valid ObjectId")

                                        c.grades.push(result)
                                        console.log("push " + result._id)
                                        if (c.grades.length == arr_grades.length) {
                                            console.log("all grades of this cadre was pushed")
                                            // return // equivalent of continue

                                            if (key === arr.length - 1) // check if that is the last cadre
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
                console.log("cadres => ", cadres)
                Cadre.insertMany(cadres, function (err) {
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

            } else if (results.findGrades && results.insertEchelons) {
                console.log('New cadre: eg. ' + JSON.stringify(cadres[0]))
                res.end("insert cadres finished")
            }
        }
    )

}