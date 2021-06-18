const mongoose = require("mongoose")
const messages = require("./config/messages")
const Schema = mongoose.Schema

const personnelConf = require("./config/personnelConf")


const PersonnelSchema = new Schema({
    personne : {
        type: Schema.Types.ObjectId,
        ref : "Personne",
        required: [true,"Les coordonnées du personne sont requises"],
        unique :  "Les coordonnées de cette personne sont déja liées à un autre personnel"
    },
    SOM: {
        type: Number,
        required : [true, "Ce champ est requis"],
        unique : "Ce numéro de SOM est déja pris!",
        min: [100000, "Ce numéro de SOM n'est pas valide"],
        max: [99999999, "Ce numéro de SOM n'est pas valide"]
    },
    /* dateRecrutement : {
        type: Date,
        required: [true,"Ce champ est requis"],
    }, */
    /*  arrete: {
        type: String,
        required: [true,"Ce champ est requis"],
        minlength: messages.minlength(10),
        maxlength: messages.maxlength(20)
    }, */
    dateIntegrationFST : {
        type: Date,
        required: [true,"Ce champ est requis"],
    },
    fonction : {
        type: String,
        required : [true, "Ce champ est requis"],
        minlength: messages.minlength(5),
        maxlength: messages.maxlength(120)
    },
    fonctionAr : {
        type: String,
        required : [true, "Ce champ est requis"],
        minlength: messages.minlength(5),
        maxlength: messages.maxlength(120)
    },
    debutFonction : {
        type: Date,
        required: [true,"Ce champ est requis"],
    },
    emailAcademique : {
        type: String,
        required : [true, "Ce champ est requis"],
        minlength: messages.minlength(8),
        maxlength: messages.maxlength(50),
        unique: "Cette adresse email est déja pris!",
    },
    /* categorie : {
        type: String,
        required: [true, "Ce champ est requis"],
        enum: {
            values: Object.keys(personnelConf.categories),
            message : "Veuillez choisissez une catégorie"
        } 
    }, */

    /* Foreign keys */
    notaions: [{
        type: Schema.Types.ObjectId,
        ref: 'Notation',
    }],
    punitions: [{
        type: Schema.Types.ObjectId,
        ref: 'Punition',
    }],
    prix: [{
        type: Schema.Types.ObjectId,
        ref: 'Prix',
    }],
    conges: [{
        type: Schema.Types.ObjectId,
        ref: 'Conge',
    }],
    nominations: [{
        type: Schema.Types.ObjectId,
        ref: 'Nomination',
    }],
    diplomes: [{
        type: Schema.Types.ObjectId,
        ref: 'Diplome',
        required: [true, "Vous devez ajouter au moins un diplôme"],
    }],
    taches: [{
        type: Schema.Types.ObjectId,
        ref: 'Tache',
        required: [true, "Vous devez ajouter au moins une tache"],
    }],
    missions: [{
        type: Schema.Types.ObjectId,
        ref: 'Mission'
    }],
    avancements: [{
        type: Schema.Types.ObjectId,
        ref: 'Avancement',
        required: [true, "Vous devez ajouter au moins un avancement"],
    }],

})

PersonnelSchema.plugin(require('mongoose-beautiful-unique-validation'))
module.exports = mongoose.model("Personnel", PersonnelSchema)