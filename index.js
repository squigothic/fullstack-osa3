const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

let persons = [
  {
    "name": "Arto Hellas",
    "number": "4864684684",
    "id": 1
  },
  {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "number": "0000",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "45678",
    "id": 4
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
}) 

app.get('/info', (req, res) => {
  res.send(`<p>Puhelinluettelo sisältää ${persons.length} henkilön tiedot</p><p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if ( person ) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const generateId = () => {
  const id = Math.floor(Math.random() * 1000000)
  return id
}

const checkDuplicate = (name) => {
  const names = persons.map(person => person.name)
  if (names.includes(name)) {
    return true
  } else {
    return false
  }
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({error: 'content missing'})
  }

  if(checkDuplicate(body.name)) {
    return res.status(400).json({error: 'name already in the database'})
  }

  const person = {
    name: body.name, 
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})