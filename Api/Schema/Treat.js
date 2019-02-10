const mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ValidateSchema = new Schema({
    _treatment: [{ type: ObjectId, ref: 'Command' }],
    Analyse: {
        type: Number,
        required: true,
        default: 0,
    },
}, { versionKey: false });
ValidateSchema.plugin(timestamps);
module.exports = mongoose.model('Treatment', ValidateSchema);
