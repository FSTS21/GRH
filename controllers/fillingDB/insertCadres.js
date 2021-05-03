module.exports = (req, res, next) => {
    require("../../fillingDB/cadres")
    res.end("insert cadres")
}