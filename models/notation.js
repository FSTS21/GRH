const mongoose = require("mongoose")
const Schema = mongoose.Schema
const messages = require("./config/messages")
const notationConf = require("./config/notationConf")
const NotationSchema = Schema({
    type : {
        type: String,
        required: [true, "Ce champ est requis"],
        enum: {
            values: Object.keys(notationConf.type),
            message : "Veuillez choisir le type du congé"
        }
    },   
    note : {
        type: Number,
        required : [true, "Ce champ est requis"],
        min : messages.min(0),
        max : messages.max(20)
    },
    annee : {
        type: Number,
        required : [true, "Ce champ est requis"],
        min : messages.minlength(1950),
        max : messages.maxlength(2050),
    },
    carte : {
        type: String,
        required: [true,"Ce champ est requis"],
        minlength: messages.minlength(10),
        maxlength: messages.maxlength(20)
    }
})



module.exports = mongoose.model("Notation",NotationSchema)