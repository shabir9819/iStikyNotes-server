const express = require("express");
const fetchUser = require("../middleware/fetchUser");
const router = express.Router();
const Notes = require("../models/note");
const validator = require("validator");

//Route: 1 Getting all the notes of the user using GET ("/fetchAllNotes")
router.get("/fetchAllNotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    let success = true;
    return res.status(200).json({ success, notes });
  } catch (error) {
    let success = false;
    return res.status(400).json({ success, error });
  }
});

//Route: 2 Adding a note of the user using POST ("/addNote")
router.post("/addNote", fetchUser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    let success = false;
    if (validator.isEmpty(title) || validator.isEmpty(description)) {
      return res
        .status(400)
        .json({ success, error: "Please fill the section." });
    }


    const note = { user: req.user.id, title, description, tag };

    const addedNote = await Notes.insertMany([note]);
    
    
    success = true;
    res.status(200).json({ success, addedNote });
  } catch (error) {
    let success = false;
    res.status(400).json({ success, error });
  }
});

//Route: 3 Updating a note of the user using POST ("/updateNote")
router.post("/updateNote/:id", fetchUser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    let success = false;
    if (validator.isEmpty(title) || validator.isEmpty(description)) {
      return res
        .status(400)
        .json({ success, error: "Please fill the section." });
    }

    //Finding the existing user by user id
    const _id = req.params.id;
    const existingNote = await Notes.findById({ _id });


    if (!existingNote) {
      return res.status(404).json({ success, error: "Not found." });
    } else if (existingNote.id !== _id) {
      return res.status(404).json({ success, error: "Not Allowed." });
    }
    const newNote = { title, description, tag };
    const updatedNote = await Notes.findByIdAndUpdate(
      { _id },
      { $set: newNote },
      { new: true }
    );

    success = true;
    res.status(200).json({ success, updatedNote });
  } catch (error) {
    let success = false;
    res.status(400).json({ success, error });
  }
});

//Route: 4 Deleting a note of the user using POST ("/deleteNote")
router.post("/deleteNote/:id", fetchUser, async (req, res) => {
  try {
    let success = false;

    //Finding the existing user by user id
    const _id = req.params.id;
    const existingNote = await Notes.findById({ _id });


    if (!existingNote) {
      return res.status(404).json({ success, error: "Not found." });
    } else if (existingNote.id !== _id) {
      return res.status(404).json({ success, error: "Not Allowed." });
    }
    const deletedNote = await Notes.findByIdAndDelete({ _id });

    success = true;
    res.status(200).json({ success, deletedNote });
  } catch (error) {
    let success = false;
    res.status(400).json({ success, error });
  }
});

module.exports = router;
