const express = require('express')
const app = express()
// const bodyParser = require("body-parser");
app.use(express.json())

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
const cors = require('cors')

app.use(cors())

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-05-30T17:30:31.098Z",
    important: true,
    completed: false
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-05-30T18:39:34.091Z",
    important: false,
    completed: true
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-05-30T19:20:14.298Z",
    important: true,
    completed: false
  }
]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('-----------------------')
  next()
}

app.use(requestLogger)

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response, next) => {
  response.json(notes)
})

app.get('/api/notes/stats', (request, response, next) => {
  const stats = {
    status: "server is running",
    count: notes.length,
    date: new Date()
  }
  response.send(`
    <p>Server is up</p>
    <p>${JSON.stringify(stats)}</p>
  `)
}
)

app.get('/api/notes/:id', (request, response, next) => {
  const id = Number(request.params.id)
  const noteFound = notes.find(note => note.id === id)
  if (noteFound) {
    return response.json(noteFound)
  } else {
    return response.status(404).json({ message: "note not found" })
  }
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response, next) => {
  const body = request.body
  if (!body.content) {
    return response.status(400).json({ message: 'content is missing' })
  }

  const note = {
    id: generateId(),
    content: body.content,
    date: new Date(),
    important: body.important || false,
    completed: body.completed
  }

  notes = notes.concat(note)
  console.log(note)
  response.json(note)
})

app.put('/api/notes', (request, response, next) => {
  const id = Number(request.params.id)
  const existingNote = notes.find((note) => note.id === id)
  const body = request.body
  if (!body) {
    return response.status(400).json({ message: 'missing data' })
  }
  if (existingNote) {
    console.log('exist', existingNote)
  }
  const updatedNote = { ...existingNote, ...request.body, updatedDate: new Date() }

  notes = notes.map((note) => note.id === updatedNote.id ? updatedNote : note)
  console.log('notes', notes)
  response.status(200).send({ message: 'note updated successfully', updatedNote })
})

app.delete('/api/notes/:id', (request, response, next) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port http://127.0.0.1:${PORT}`)
})

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)