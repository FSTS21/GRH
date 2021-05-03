const config = require("./config")

module.exports =  function (req, res, next) {
    res.render(config.page, {
        ...config.initPage,
        personne: {
            dateNaissance: null
        }
    })
    // return
}