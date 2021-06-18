const mongoose = require("mongoose")
const Schema = mongoose.Schema
const avancementConf = require("./config/avancementConf")
const messages = require("./config/messages")
require('custom-env').env(true)

const AvancementSchema = Schema({
    filling : {
        type : Boolean,
        default : false,
    },
    code: {
        type: Number,
        required : [function(){
            return this.filling
        }, "Ce champ est requis"], 
        unique: "Le code est dupliqué",
        minlength : messages.minlength(1),
        maxlength :  messages.maxlength(99999),
    },
    type : {
        type: String,
        required : [true, "Ce champ est requis"],
        enum : {
            values : Object.keys(avancementConf.types),
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
        minlength: messages.minlength(20),
        maxlength: messages.maxlength(30)
    }
})

AvancementSchema.virtual("link_arrete").get( function(){
    return avancementConf.pathFolder+this.arrete
})


const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.createConnection(process.env.mongoDB, { useNewUrlParser: true ,useUnifiedTopology: true, useCreateIndex: true}))
AvancementSchema.plugin(autoIncrement.plugin, { model: 'Avancement', field: 'code' }); 

AvancementSchema.plugin(require('mongoose-beautiful-unique-validation'))
module.exports = mongoose.model("Avancement",AvancementSchema) 