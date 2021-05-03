const mongoose = require("mongoose")
const Schema = mongoose.Schema
const entiteConf = require("./config/entiteConf")

const EntiteSchema = Schema({
    type : {
        type: String,
        required : [true, "Ce champ est requis"],
        enum: {
            values: Object.keys(entiteConf.types),
            message : "Veuillez choisir le type d'entité"
        }
    },
    libelle : {
        type: String,
        required : [true, "Ce champ est requis"],
        unique : [true, "Cette entité est dupliquée!"],
        enum: {
            values: Object.keys(entiteConf.libelles),
            message : "Veuillez choisir une entité"
        }
    },
    personnels : [{
        type: Schema.Types.ObjectId,
        ref: "Personnel",
        required :[true,"Vous devez ajouter au moins un personnel à cette entité"]
    }]
})

module.exports = mongoose.model("Cadre", EntiteSchema)