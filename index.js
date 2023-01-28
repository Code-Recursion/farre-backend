require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const Note = require("./mongo");

const cors = require("cors");
const { config } = require("./utils/config");
app.use(cors());

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("-----------------------");
  next();
};

app.use(requestLogger);

app.get("/", (request, response) => {
  console.log("mongod", config.MONGODB_URI);

  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", async (request, response, next) => {
  try {
    const notes = await Note.find({});
    response.json(notes);
  } catch (error) {
    response.json({
      message: "error while fetching data",
      error: error.message,
    });
  }
});

app.get("/api/notes/stats", async (request, response, next) => {
  const totalNotes = await Note.count({});
  response.send(`
      <p>Server is up!  </p>
      <p>last request made : ${new Date().toLocaleString()}</p>
      <p>Total notes ${totalNotes}</p>
    `);
});

app.get("/api/notes/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    const noteFound = await Note.findById(id);
    if (noteFound) {
      response.json(noteFound);
    } else {
      response.json({ message: `note with given id ${id} not found` });
    }
  } catch (error) {
    response.json({
      message: "error while fetching data",
      error: error.message,
    });
  }
});

app.post("/api/notes", (request, response, next) => {
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
      console.log("res", res);
      response.json(res);
    })
    .catch((err) => {
      console.log("err", err);
      response.json(err);
    });
});

app.put("/api/notes", async (request, response, next) => {
  try {
    const { note } = request.body
    const noteFound = await Note.findById(note.id);
    if (noteFound) {
      const res = await Note.findByIdAndUpdate(note.id, note)
      response.json({ message: "note updated", res })
    } else {
      response.json({ message: `note with given id ${id} not found` });
    }
  }
  catch (error) {
    response.staus(500).json({ message: "error while fetching data", error: error.message })
  }
});

app.delete("/api/notes/:id", async (request, response, next) => {
  const id = request.params.id
  // notes = notes.filter((note) => note.id !== id);
  try {
    const noteFound = await Note.findById(id);
    if (noteFound) {
      await Note.findByIdAndRemove(id)
      response.status(200).json({ success: true, message: `note with id ${id}, deleted successfully` });
    } else {
      response.json({ success: false, message: `note with given id ${id} not found` });
    }
  } catch (error) {
    console.log('error occured while deleting', error);
    response.status(500).json({ message: "error occured while deleting", error })
  }
});

const PORT = config.PORT | 3001;
app.listen(PORT, () => {
  console.log(`Server running on port http://127.0.0.1:${PORT}`);
});

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

app.use(errorHandler)