const echelons = [{
    code: 1,
    titre: "3",
    indice: 325,
    str_avancements: "20;21",
  }

]

const Echelon = require("../models/echelon")
const EchelonDao = require("../Dao/echelonDao")

function bookCreate(params) {
  const bookdetail = {
    ...params
  }

  var echelon = new Echelon(bookdetail);
  echelon.save(function (err) {
    if (err) {
      // alert("error")
      console.log("error" + err)
      return
    }
    console.log('New Echelon: ' + echelon);
  });
}


module.exports = echelons.forEach(c => {
  c.avancements = new Array
  const arr_avancements = c.str_avancements.split(";")
  arr_avancements.forEach(av => {
    EchelonDao.findByCode(av.trim())
      .then(result => {
        if (Object.keys(result).length) {
          // res.locals.influencer = result
          c.avancements.push(result._id)
        } else {
          console.log("can't load influencer infos")
        }
      }).catch(err => {
        console.log("%s <= Error when loading influencer infos", err)
      })
  })
  bookCreate(c)
});