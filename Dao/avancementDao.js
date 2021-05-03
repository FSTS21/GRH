// const ObjectId = require('mongoose').Types.ObjectId;
const Avancement = require("../models/avancement")

const findByCode = (code) => {
    const obj = {
        code: code
    }
    console.log("avancementDao.findByCode => %s", obj)
    return Avancement.findOne(obj)
}
exports.findByCode = findByCode

