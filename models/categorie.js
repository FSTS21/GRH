const mongoose = require("mongoose")
const Schema = mongoose.Schema
const categorieConf = require("./config/categorieConf")
const messages = require("./config/messages")

const CategorieSchema = Schema({
    code: {
        type: Number,
        required : true,
        unique : "Code dupliqué !",
        minlength : messages.minlength(1),
        maxlength :  messages.maxlength(99999),
    },
    libelle : {
        type: String,
        required : [true, "Ce champ est requis"],
        unique : [true, "Cette catégorie est dupliquée!"],
        enum: {
            values: Object.keys(categorieConf.libelles),
            message : "Veuillez choisir une catégorie valide"
        }
    },
    cadres : [{
        type: Schema.Types.ObjectId,
        ref: 'Cadre',
        required : [true, "Vous devez ajouter au moins un cadre"],
    }],
})

CategorieSchema.plugin(require('mongoose-beautiful-unique-validation'))
module.exports = mongoose.model("Categorie", CategorieSchema)