module.exports = (req, res, next) => {
    const avancements = require("./DB/avancements.json")
    const Avancement = require("../../models/avancement")
    const async = require("async")

    const specialFncs = require("../../config/specialFunctions")
      
    async.series([
        callback => {
            Avancement.insertMany(specialFncs.trimmedData(avancements), function (err) {
                if (err) {
                    callback(err, null);
                } else
                    callback(null, true);
            });
        }
    ], (err, results) => {
        if (err)
            res.end("err : " + err)
        else if (results){
            console.log('New Avancements: eg. ' + JSON.stringify(avancements[0]))
            res.end("insert avancements finished")
        }
    })

}