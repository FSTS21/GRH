const mongoose = require("mongoose")
const Schema = mongoose.Schema
const messages = require("./config/messages")

const AgentSchema = Schema({
    personne : {
        type: Schema.Types.ObjectId,
        ref : "Personne",
        required: [true,"Les coordonnées du personne sont requises"],
        unique :  "Les coordonnées de cette personne sont déja liées à un autre personnel"
    },
    societe : {
        type: String,
        required : [true, "Ce champ est requis"],
        minlength : messages.minlength(80),
        maxlength :  messages.maxlength(120),
    },
    mission : {
        type: String,
        required : [true, "Ce champ est requis"],
        minlength : messages.minlength(80),
        maxlength :  messages.maxlength(120),
    },
    missionAr : {
        type: String,
        required : [true, "Ce champ est requis"],
        minlength : messages.minlength(80),
        maxlength :  messages.maxlength(120),
    },
    horaire : {
        type: String,
        required : [true, "Ce champ est requis"],
        minlength : messages.minlength(80),
        maxlength :  messages.maxlength(100),
    },
    lieuAffectation : {
        type: String,
        required : [true, "Ce champ est requis"],
        minlength : messages.minlength(80),
        maxlength :  messages.maxlength(100),
    }

})


module.exports = mongoose.model("Agent",AgentSchema)