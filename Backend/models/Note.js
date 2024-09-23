const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    email: String,
    group: String,
    text: String,
    color: String,
    trash: Boolean,
});

module.exports = mongoose.model('Note', NoteSchema);
