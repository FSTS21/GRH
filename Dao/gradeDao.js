// const ObjectId = require('mongoose').Types.ObjectId;
const Grade = require("../models/grade")

const findByCode = (code) => {
    const obj = {
        code: code
    }
    // console.log("EchelonDao.findByCode => %s", obj)
    return Grade.findOne(obj)
}
exports.findByCode = findByCode

