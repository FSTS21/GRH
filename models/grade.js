const mongoose = require("mongoose")
const Schema = mongoose.Schema
const gradeConf = require("./config/gradeConf")
const messages = require("./config/messages")

const GradeSchema = Schema({
    code: {
        type: Number,
        required : true,
        unique : "Code dupliqué!",
        minlength : messages.minlength(1),
        maxlength :  messages.maxlength(99999),
    },
    libelle : {
        type: String,
        required : [true, "Ce champ est requis"],
        enum: {
            values: Object.keys(gradeConf.libelles),
            message : "Veuillez choisir un grade parmi la liste"
        }
    },
    echelons : [{
        type: Schema.Types.ObjectId,
        ref: "Echelon",
        required :[true,"Vous devez alimenter le grade avec ces echelons"]
    }]
},{toJSON: { virtuals: true } })

GradeSchema.virtual("libelle_tr").get( function(){
    return "models.grade.libelle."+this.libelle
})



GradeSchema.plugin(require('mongoose-beautiful-unique-validation'))
GradeSchema.plugin(require('mongoose-deep-populate')(mongoose))
GradeSchema.plugin(require('mongoose-lean-virtuals'));

module.exports = mongoose.model("Grade", GradeSchema)