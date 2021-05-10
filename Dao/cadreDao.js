// const ObjectId = require('mongoose').Types.ObjectId;
const Cadre = require("../models/cadre")

const findByCode = (code) => {
    const obj = {
        code: code
    }
    // console.log("EchelonDao.findByCode => %s", obj)
    return Cadre.findOne(obj)
}
exports.findByCode = findByCode

