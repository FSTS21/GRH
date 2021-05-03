
const config = require("./config")

module.exports = (err, req, res, next) => {
    res.locals.result = "Une erreur s'est produite! veuillez réessayez"
    console.log("%s \n %s ", err, res.locals.result)
    res.render(config.page, {
        ...config.initPage
    })
    return
}