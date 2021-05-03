const mongoose = require("mongoose")
const Schema = mongoose.Schema
const messages = require("./config/messages")
const diplomeConf = require("./config/diplomeConf")

const DiplomeSchema = Schema({
    libelle: {
        type: String,
        required: [true, "Ce champ est requis"],
        minlength : messages.minlength(8),
        maxlength :  messages.maxlength(80),
    },
    domaine: {
        type: String,
        required: [true, "Ce champ est requis"],
        enum: {
            values: Object.keys(diplomeConf.domaines),
            message : "Veuillez choisir le domaine"
        }
    },
    annee : {
        type: Number,
        required : [true, "Ce champ est requis"],
        min : messages.minlength(1950),
        max : messages.maxlength(2050),
    },
    etablissement: {
        type: String,
        required: [true, "Ce champ est requis"],
        enum: {
            values: Object.keys(diplomeConf.etablissements),
            message : "Veuillez choisir l'établissement"
        }
    },
    ville: {
        type: String,
        required: [true, "Ce champ est requis"],
        enum: {
            values: Object.keys(diplomeConf.villes),
            message : "Veuillez choisir la ville"
        }
    },
})

module.exports = mongoose.model("Diplome",DiplomeSchema)