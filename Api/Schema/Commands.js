const mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

var CommandSchema = new Schema({
    prenom: {
        type: String,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    adresse: {
        type: String,
    },
    telephone: {
        type: String,
    },
    date: {
        type: String,
    },
    horaire: {
        type: Number,
    },
    demande: {
        type: String,
        default: "EN COURS DE TRAITEMENT",
    },
    treatment: [{type: ObjectId, ref: 'Treatment'}],
}, {versionKey: false});
CommandSchema.plugin(timestamps);
module.exports = mongoose.model('Command', CommandSchema);




