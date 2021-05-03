module.exports = (req, res, next) => {
    const avancements = require("./DB/avancements.json")
    // const Avancement = require("../../models/avancement")
    const async = require("async")

    // const specialFncs = require("../../config/specialFunctions")
      
    const a = false
    async.series({

        test_1 : callback => {
                if (a) {
                    callback(null, true);
                } else
                callback(new Error("test error"));
            }
    }, (err, results) => {
        if (err)
            console.log("err : " + err)
        else if (results)
            console.log('New Avancements: eg. ' + JSON.stringify(avancements[0]))
        res.end("insert avancements finished")
    })

}