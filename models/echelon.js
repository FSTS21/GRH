const mongoose = require("mongoose")
const Schema = mongoose.Schema
const messages = require("./config/messages")
const EchelonSchema = Schema({
    code: {
        type: Number,
        required : true,
        unique : "Code dupliqué!",
        minlength : messages.minlength(1),
        maxlength :  messages.maxlength(99999),
    },
    titre : {
        type: String,
        required : [true, "Ce champ est requis"],
        minlength : messages.minlength(1),
        maxlength :  messages.maxlength(30),
    },
    indice : {
        type: Number,
        required : [true, "Ce champ est requis"],
        min : messages.minlength(100),
        max :  messages.maxlength(9999),
    },
    avancements : [{
        type: mongoose.Types.ObjectId,
        ref: "Avancement"
    }]
})

EchelonSchema.plugin(require('mongoose-beautiful-unique-validation'))
module.exports = mongoose.model("Echelon", EchelonSchema)