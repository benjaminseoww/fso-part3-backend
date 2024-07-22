// set up node runtime server using express
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));
app.use(cors())

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const Person = require('./model')

// backend functionalities 
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response, next) => {
  //response.send(persons)
  Person.find({}).then(persons => {
    response.json(persons)
  })
  .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  // cant do this as index in frontend is index in the array, not the 12 hex string
  // need to change frontend code to use database id instead of array index

  Person.findByIdAndDelete(request.params.id).then(person => {
    response.status(204).end();
  })
  .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {

  // mongodb gives own id by itselfs

  const body = request.body;

  const newPerson = new Person({
    name: body.name,
    number: body.number,
    important: body.important || false,
  }) 

  newPerson.save().then(savedPerson => {
    response.json(savedPerson);
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;
  const newPerson = {
    name: body.name,
    number: body.number,
    important: body.important || false,
  }

  Person.findByIdAndUpdate(request.params.id, newPerson, {new: true, runValidators: true}).then(person => {
    response.json(person);
  })
  .catch(error => next(error))
})

app.get('/api/info', (request, response) => {
  response.send(
    `Phonebook has info for ${Person.length} people` + '<br>' +
    `${new Date(Date.now()).toString()}`
  )
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})