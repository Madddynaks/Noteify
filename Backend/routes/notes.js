const express = require('express');
const router = express.Router();
const controller = require("../controller/Notes");

router.post('/save', controller.saveNote); 
router.get('/fetchNotes', controller.findNote);
router.put('/update/:id', controller.updateNote);
router.put('/delete/:id', controller.deleteNote);
router.get('/fetchTrash', controller.fetchTrash);
router.put('/restoreTrash/:id', controller.restoreTrash);


module.exports = router;
