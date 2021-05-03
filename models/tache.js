const mongoose = require("mongoose")
const Schema = mongoose.Schema
const messages = require("./config/messages")
// const congeConf = require("./config/congeConf")
const TacheSchema = Schema({
    libelle: {
        type: String,
        required: [true, "Ce champ est requis"],
        minlength : messages.minlength(3),
        maxlength :  messages.maxlength(30),
    },
    libelleAr: {
        type: String,
        required: [true, "Ce champ est requis"],
        minlength : messages.minlength(3),
        maxlength :  messages.maxlength(30),
    }
})

module.exports = mongoose.model("Tache",TacheSchema)