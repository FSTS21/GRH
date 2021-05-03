const mongoose = require("mongoose")
const Schema = mongoose.Schema
// const messages = require("./config/messages")
const congeConf = require("./config/congeConf")
const CongeSchema = Schema({
    type: {
        type: String,
        required: [true, "Ce champ est requis"],
        enum: {
            values: Object.keys(congeConf.types),
            message: "Veuillez choisir le type du congé"
        }
    },
    duree: {
        type: Schema.Types.ObjectId,
        ref: "Duree",
        required: [true, "Veuillez ajouter la durée"]
    },
})



module.exports = mongoose.model("Conge", CongeSchema)