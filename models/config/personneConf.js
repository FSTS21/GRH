exports.situations = {
    "celib"     : "models.personne.situation.celib",
    "marie"     : "models.personne.situation.marie",
    "divorce"   : "models.personne.situation.divorce",
}

exports.sexes = {
    "masculin" : "Masculin",
    "feminin" : "Féminin"
}

exports.nationnalites = {
    "marocaine" : "Marocaine",
    "inter" : "Internationale"
}

const photosFolder = "photos/"
require('custom-env').env(true)
exports.pathFolder = process.env.pathFolder+photosFolder
