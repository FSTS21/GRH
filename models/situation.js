const mongoose = require("mongoose")
const Schema = mongoose.Schema
const situationConf = require("./config/situationConf")

const SituationSchema = new Schema({

    libelle : {
        type: String,
        required : [true, "Ce champ est requis"],
        enum: {
            values: Object.keys(situationConf.libelles),
            message : "Veuillez choisir une situation"
        }
    },
    personnels : {
        type: Schema.Types.ObjectId,
        ref: "Personnel"
    },
})


module.exports = mongoose.model("Situation", SituationSchema)