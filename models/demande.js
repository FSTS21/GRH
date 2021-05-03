const mongoose = require("mongoose")
const Schema = mongoose.Schema
const messages = require("./config/messages")
const demandeConf = require("./config/demandeConf")
const DemandeSchema = Schema({
    type: {
        type: String,
        required: [true, "Ce champ est requis"],
        enum: {
            values: Object.keys(demandeConf.documents),
            message : "Veuillez choisir le document"
        }
    },
    motif: {
        type: String,
        required: [true, "Ce champ est requis"],
        minlength : messages.minlength(3),
        maxlength :  messages.maxlength(180),
    },
    date : {
        type: Date,
        required : [true, "Ce champ est requis"],
    },
    statut: {
        type: String,
        required: [true, "Ce champ est requis"],
        enum: {
            values: Object.keys(demandeConf.statuts),
            message : "Veuillez choisir le statut"
        }
    }

})

module.exports = mongoose.model("Demande",DemandeSchema)