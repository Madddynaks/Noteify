const Note = require("../models/Note");

const saveNote = async (req, res) => {
  try {
    const note = new Note(req.body);
    await note.save();
    res.send(note);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};

const findNote = async (req, res) => {
  try {
    const notes = await Note.find({ trash: false });
    res.send(notes);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};



const updateNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(note);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};

const deleteNote = async (req, res) => {
  try {
    const result = await Note.findByIdAndUpdate(req.params.id, { trash: true }, { new: true });
    if (!result) {
      return res.status(404).send({ message: 'Note not found' });
    }
    console.log(result);
    res.send({ message: 'Note moved to trash', note: result });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};

const fetchTrash = async (req, res) => {
  try {
    console.log("hello")
    const notes = await Note.find({ trash: true });
    console.log(notes);
    res.send(notes);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};

const restoreTrash = async (req, res) => {
  try {
    const result = await Note.findByIdAndUpdate(req.params.id, { trash: false }, { new: true });
    if (!result) {
      return res.status(404).send({ message: 'Note not found' });
    }
    console.log(result);
    res.send({ message: 'Note moved to trash', note: result });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};

module.exports = {
  saveNote,
  findNote,
  updateNote,
  deleteNote,
  fetchTrash,
  restoreTrash
};
