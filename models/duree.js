const mongoose = require("mongoose")
const Schema = mongoose.Schema

const DureeSchema = Schema({
    debut : {
        type: Date,
        required : [true, "Ce champ est requis"],
    },
    fin : {
        type: Date,
        required : [true, "Ce champ est requis"],
    }
    
})

module.exports = mongoose.model("Duree", DureeSchema)