const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get("/", async (request, response, next) => {
  try {
    const notes = await Note.find({});
    response.json(notes);
  } catch (error) {
    next(error)
  }
});

notesRouter.get("/stats", async (request, response, next) => {
  const totalNotes = await Note.count({});
  response.send(`
      <p>Server is up!  </p>
      <p>last request made : ${new Date().toLocaleString()}</p>
      <p>Total notes ${totalNotes}</p>
    `);
});

notesRouter.get("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    const noteFound = await Note.findById(id);
    if (noteFound) {
      response.json(noteFound);
    } else {
      response.json({ message: `note with given id ${id} not found` });
      //  TODO: handle it in middleware
      // next(`note with given id ${id} not found`)
    }
  } catch (error) {
    next(error)
  }
});

notesRouter.post("/", (request, response, next) => {
  const { note } = request.body;
  if (!note.content) {
    return response.status(400).json({ message: "content is missing" });
  }

  const newNote = new Note({
    content: note.content,
    date: new Date(),
    isImportant: note.isImportant | false,
    isCompleted: false,
  });

  newNote
    .save()
    .then((res) => {
      response.satatus(200).json(res)
    })
    .catch(error => next(error))
});

notesRouter.put("/", async (request, response, next) => {
  try {
    const { note } = request.body
    const noteFound = await Note.findById(note.id);
    if (noteFound) {
      const res = await Note.findByIdAndUpdate(note.id, note, { new: true, runValidators: true, context: 'query' })
      response.json({ message: "note updated", res })
    } else {
      response.json({ message: `note with given id ${id} not found` });
    }
  }
  catch (error) {
    next(error)
  }
});

notesRouter.delete("/:id", async (request, response, next) => {
  const id = request.params.id
  try {
    const noteFound = await Note.findById(id);
    if (noteFound) {
      await Note.findByIdAndRemove(id)
      response.status(200).json({ success: true, message: `note with id ${id}, deleted successfully` });
    } else {
      response.json({ success: false, message: `note with given id ${id} not found` });
    }
  } catch (error) {
    next(error)
  }
});

module.exports = notesRouter