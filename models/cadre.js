const mongoose = require("mongoose")
const Schema = mongoose.Schema
const cadreConf = require("./config/cadreConf")
const messages = require("./config/messages")

const CadreSchema = Schema({
    code: {
        type: Number,
        required : true,
        unique: "Le code est dupliqué !",
        minlength : messages.minlength(1),
        maxlength :  messages.maxlength(99999),
    },
    libelle : {
        type: String,
        required : [true, "Ce champ est requis"],
        unique : [true, "Ce cadre est dupliqué!"],
        enum: {
            values: Object.keys(cadreConf.libelles),
            message : "Veuillez choisir un cadre"
        }
    },
    grades: [{
        type: Schema.Types.ObjectId,
        ref: 'Grade',
        required : [true, "Vous devez ajouter au moins un grade"],
    }],
})


CadreSchema.virtual("libelle_tr").get( function(){
    return "models.cadre.libelle."+this.libelle
})

CadreSchema.plugin(require('mongoose-beautiful-unique-validation'))
CadreSchema.plugin(require('mongoose-deep-populate')(mongoose))
CadreSchema.plugin(require('mongoose-lean-virtuals'));
module.exports = mongoose.model("Cadre", CadreSchema)