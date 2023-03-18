const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const testHelper = require('./test_helper.js')

const api = supertest(app)

const Note = require('../models/note')

beforeEach(async () => {
  await Note.deleteMany({})
  let noteObject = new Note(testHelper.initialNotes[0])
  await noteObject.save()
  noteObject = new Note(testHelper.initialNotes[1])
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
  expect(response.body).toHaveLength(testHelper.initialNotes.length)
})

test('first note is about html', async () => {
  const response = await api.get('/api/notes')
  expect(response.body[0].content).toBe('HTML is easy')
})

test('a note can be created', async () => {
  const newNote = {
    "note": {
      "title": "title",
      "content": "async/await simplifies making async calls",
      "important": false,
      "completed": false
    }
  }
  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)

  expect(response.body).toHaveLength(testHelper.initialNotes.length + 1)
  expect(contents).toContain(
    'async/await simplifies making async calls'
  )

})

test('a note without content cannot be created', async () => {
  const newNote = {
    "note": {
      "title": "title",
      "important": false,
      "completed": false
    }
  }
  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const response = await testHelper.notesInDb()

  expect(response).toHaveLength(testHelper.initialNotes.length)
})

afterAll(async () => {
  await mongoose.connection.close()
})