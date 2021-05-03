const mongoose = require("mongoose")
const Schema = mongoose.Schema
const messages = require("./config/messages")
const personneConf = require("./config/personneConf")

const PersonneSchema = new Schema({
    CIN : {
        type: String,
        required : [true, "le CIN est requis"],
        unique: "Ce CIN est déja enregistré dans nos bases de données",
        minlength : messages.minlength(3),
        maxlength :  messages.maxlength(10),
    },
    nom : {
        type : String,
        required : [true, "Le nom est requis"],
        minlength : messages.minlength(3),
        maxlength :  messages.maxlength(60) ,
    }, 
    prenom : {
        type : String, 
        required : [true, "Le prénom est requis"],
        minlength : messages.minlength(3),
        maxlength :  messages.maxlength(60) ,
    },
    nomAr : {
        type : String,
        minlength : messages.minlength(3),
        maxlength :  messages.maxlength(60) ,
    },
    prenomAr : {
        type : String,
        minlength : messages.minlength(3),
        maxlength :  messages.maxlength(60) ,
    },
    dateNaissance : {
        type: Date,
        required: [true,"Ce champ est requis"],
    },
    lieuNaissance : {
        type : String,
        required : [true, "Le lieu de naissance est requis"],
        minlength : messages.minlength(3),
        maxlength :  messages.maxlength(60) ,
    },
    lieuNaissanceAr : {
        type : String,
        minlength : messages.minlength(3),
        maxlength :  messages.maxlength(60)
    },
    situationFamiliale: {
        type: String,
        required: [true, "Ce champ est requis"],
        enum: {
            values: Object.keys(personneConf.situations),
            message : "Veuillez choisir une situation familiale valide"
        }
    },
    nbEnfants : {
        type: Number,
        required : [true, "Ce champ est requis"],
        default : 0,
        min : messages.min(0),
        max : messages.max(20)
    },
    email: {
        type: String,
        required: [true,"Ce champ est requis"],
        minlength: messages.minlength(8),
        maxlength: messages.maxlength(50),
        unique: "Cette adresse email est déja pris!",
    },
    adresse: {
        type: String,
        required: [true, "Ce champ est requis"],
        minlength: messages.minlength(8),
        maxlength: messages.maxlength(120),
    },
    matriculeVehicule :  {
        type : String,
        minlength: messages.minlength(4),
        maxlength: messages.maxlength(20),
    },
    gsm: {
        type : String,
        required: [true, "Ce champ est requis"],
        minlength: messages.minlength(10),
        maxlength: messages.maxlength(18)
    },
    numFix: {
        type : String,
        required: false,
        minlength: messages.minlength(10),
        maxlength: messages.maxlength(18)
    },
    sexe: {
        type: String,
        required: [true, "Ce champ est requis"],
        enum: {
            values: Object.keys(personneConf.sexes),
            message : "Veuillez choisissez un sexe valide"
        }
    },
    nationnalite: {
        type: String,
        required: [true, "Ce champ est requis"],
        default: "Marocaine",
        enum: {
            values: Object.keys(personneConf.nationnalites),
            message : "Veuillez choisissez une nationnalité valide"
        }
    },
    photo: {
        type: String,
        // minlength: messages.minlength(10),
        maxlength: messages.maxlength(20)
    },

    /* Foreign keys */
    demandes: [{
        type: Schema.Types.ObjectId,
        ref: 'Demande',
    }],
})

PersonneSchema.plugin(require('mongoose-beautiful-unique-validation'))
module.exports = mongoose.model("Personne", PersonneSchema)