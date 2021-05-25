const mongoose = require("mongoose")
const Schema = mongoose.Schema
const avancementConf = require("./config/avancementConf")
const messages = require("./config/messages")
const AvancementSchema = Schema({
    code: {
        type: Number,
        required : [true, "Ce champ est requis"],
        unique: "Le code est dupliqué",
        minlength : messages.minlength(1),
        maxlength :  messages.maxlength(99999),
    },
    type : {
        type: String,
        required : [true, "Ce champ est requis"],
        enum : {
            values : avancementConf.types.keys,
            message : "Veuillez choisir un type d'avancement valide"
        }
    },
    dateEffet : {
        type: Date,
        required : [true, "Ce champ est requis"]
    }, 
    dateCreation : {
        type: Date,
        required : [true, "Veuillez vérifier la date de votre systéme"],
        default : Date.now,
    }, 
    arrete : {
        type: String,
        required: [true,"Ce champ est requis"],
        minlength: messages.minlength(10),
        maxlength: messages.maxlength(20)
    }
})

AvancementSchema.plugin(require('mongoose-beautiful-unique-validation'))
module.exports = mongoose.model("Avancement",AvancementSchema)