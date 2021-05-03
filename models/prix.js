const mongoose = require("mongoose")
const Schema = mongoose.Schema
const messages = require("./config/messages")
const prixConf = require("./config/prixConf")
const PrixSchema = Schema({
    libelle : {
        type: String,
        required : [true, "Ce champ est requis"],
        minlength : messages.minlength(5),
        maxlength :  messages.maxlength(80),
    },
    type: {
        type: String,
        required: [true, "Ce champ est requis"],
        enum: {
            values: Object.keys(prixConf.type),
            message : "Veuillez choisir le type du prix"
        }
    },
    date : {
        type: Date,
        required : [true, "Ce champ est requis"]
    },
})



module.exports = mongoose.model("Prix",PrixSchema)