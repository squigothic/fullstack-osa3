const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./modules/person')

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(bodyParser.json())
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(Person.format))
    })
})

app.get('/info', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.status(200).send(`Puhelinluettelo sisältää ${persons.length} henkilön tiedot`)
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(Person.format(person))
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndDelete(req.params.id)
    .then(result => {
      console.log('poistettiin tietokannasta: ', result.name)
      res.status(204).end()
    })
    .catch(error => {
      console.log(error)
      res.status(400).send( { error: 'malformattaed id' })
    })
})

const checkForMatch = (result) => {
  console.log('result: ', result)
  if (result) {
    console.log('löydettiin mätsi')
    return true
  } else {
    console.log('ei löydetty mätsiä')
    return false
  }
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  const [name, number] = [body.name, body.number]

  console.log(name, number)

  if (!name || !number) {
    return res.status(400).json({ error: 'content missing' })
  }

  Person
    .findOne({ name })
    .then(checkForMatch)
    .then(matchOrNot => {
      console.log('matchOrNot tulos:', matchOrNot)
      if (matchOrNot) {
        console.log('koska mätsi, palautetaan error 400')
        res.status(400).json({ error: 'name already in the database' })
      } else {
        console.log('luodaan henkilö')
        const person = new Person({
          name,
          number
        })
        person
          .save()
          .then(savedPerson => {
            res.json(Person.format(savedPerson))
          })
          .catch(error => {
            console.log('sisemmässä promisessa virhe: ', error)
          })
      }
    })
    .catch(error => {
      console.log('virhe oli tällainen: ', error)
    })
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findOneAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})