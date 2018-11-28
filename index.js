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
      res.status(400).send( { error: 'malformattaed id' })
    })
})

/*const checkDuplicate = (name) => {
  return false
   console.log('päädyttiin checkduplicate-funkkariin')
  Person
    .find({})
    .then(result => {
      const namesList = result.map(person => person.name)
      if (namesList.includes(name)) {
        console.log("aiomme palauttaa true")
        //palauttaa jostain syystä undefined?
        return true
      }
      else {
        console.log('aiomme palauttaa false')
        //palauttaa jostain syystä undefined?
        return false
      }
    })
    .catch(error => {
      console.log(error)
    })
}*/

app.post('/api/persons', (req, res) => {
  const body = req.body
  console.log(body.name, body.number)

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'content missing' })
  }

  /* if(checkDuplicate(body.name)) {
    return res.status(400).json({ error: 'name already in the database' })
  } else { */

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(savedPerson => {
      res.json(Person.format(savedPerson))
    })
    .catch(error => {
      console.log(error)
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