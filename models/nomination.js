const mongoose = require("mongoose")
const Schema = mongoose.Schema
const messages = require("./config/messages")
// const congeConf = require("./config/congeConf")
const NominationSchema = Schema({
    poste: {
        type: String,
        required: [true, "Ce champ est requis"],
        minlength : messages.minlength(4),
        maxlength :  messages.maxlength(30),
    },
    instance: {
        type: String,
        required: [true, "Ce champ est requis"],
        minlength : messages.minlength(3),
        maxlength :  messages.maxlength(60),
    },
    duree : {
        type: Schema.Types.ObjectId,
        ref: "Duree",
        required : [true, "Veuillez ajouter la durée"]
    },
})

module.exports = mongoose.model("Nomination",NominationSchema)