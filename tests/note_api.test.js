const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
]

beforeEach(async () => {
  await Note.deleteMany({})
  let noteObject = new Note(initialNotes[0])
  await noteObject.save()
  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two notes', async () => {
  const response = await api.get('/api/notes')
  expect(response.body).toHaveLength(initialNotes.length)
})

test('first note is about html', async () => {
  const response = await api.get('/api/notes')
  expect(response.body[0].content).toBe('HTML is easy')
})

test('a note can be created', async () => {
  const newNote = {
    content: 'a valid creted note',
    isImportant: false
  }
  await api
  .post('/api/notes')
  .send(newNote)
  .expect(201)
  .expect('Content-Type', /application\/json/)
})

afterAll(async () => {
  await mongoose.connection.close()
})