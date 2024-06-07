const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));
app.use(cors())

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.send(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;

  if (id) {
    const person = persons.find(person => person.id === Number(id));

    if (person) {
      response.send(person);
    } else {
      response.status(404).end();
    }
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;

  if (id) {
    persons = persons.filter(person => person.id !== Number(id));
    response.status(204).end();
  }
})

app.post('/api/persons', (request, response) => {
  const id = Math.floor(Math.random() * 1000);

  // if id already exists
  if (persons.find(person => person.id === id)) {
    return response.status(400).json({ error: 'id must be unique' });
  }

  const body = request.body;
  
  // name missing
  if (!request.body.name) {
    return response.status(400).json({ error: 'name is missing' });
  }

  // number missing
  if (!request.body.number) {
    return response.status(400).json({ error: 'number is missing' });
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ error: 'name must be unique' });
  }

  persons = persons.concat({ ...body, id });
  return response.status(200).json({
    message: 'Resource created successfully'
  });
})

app.get('/api/info', (request, response) => {
  response.send(
    `Phonebook has info for ${persons.length} people` + '<br>' +
    `${new Date(Date.now()).toString()}`
  )
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})