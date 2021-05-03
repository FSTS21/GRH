const mongoose = require("mongoose")
const Schema = mongoose.Schema
const missionConf = require("./config/missionConf")
const messages = require("./config/messages")

const MissionSchema = Schema({
    destination : {
        type: String,
        required: [true, "Ce champ est requis"],
        minlength : messages.minlength(3),
        maxlength :  messages.maxlength(30) 
    },
    moyenTransport : {
        type: String,
        required: [true, "Ce champ est requis"],
        enum: {
            values  : Object.keys(missionConf.moyensTransport),
            message : "Veuillez choisir un moyen de transport"
        }
    },
    Objet : {
        type: String,
        required: [true, "Ce champ est requis"],
        minlength : messages.minlength(3),
        maxlength :  messages.maxlength(60) 
    },
    fraisCharge : {
        type: String,
        required: [true, "Ce champ est requis"],
        enum: {
            values  : Object.keys(missionConf.fraisCharge),
            message : "Veuillez choisir par qui sera chargés les frais de la mission"
        }
    },
    chauffeur : {
        type: String,
        minlength : messages.minlength(3),
        maxlength :  messages.maxlength(40) 
    },
    compagnons : {
        type: String,
        minlength : messages.minlength(3),
        maxlength :  messages.maxlength(160) 
    },
    duree : {
        type: Schema.Types.ObjectId,
        ref: "Duree",
        required : [true, "Veuillez ajouter la durée"]
    },
})

module.exports = mongoose.model("Mission", MissionSchema)



// /var/suvgardedb/tomcat-server/bases_donnees_FSTFES