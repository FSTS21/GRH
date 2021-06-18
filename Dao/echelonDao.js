// const ObjectId = require('mongoose').Types.ObjectId;
const Echelon = require("../models/echelon")

const findByCode = (code) => {
    const obj = {
        code: code
    }
    // console.log("EchelonDao.findByCode => %s", obj)
    return Echelon.findOne(obj)
}
exports.findByCode = findByCode

