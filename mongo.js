require("dotenv").config()
const mongoose = require('mongoose')

const url = process.env.DB_HOST

mongoose.connect(url, { useNewUrlParser: true })

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

const addToDatabse = (name, number) => {
  const person = new Person({ name, number })
  person
    .save()
    .then(response => {
      console.log(`Lisätään henkilö ${name} ${number} luetteloon`)
      mongoose.connection.close()
    })
}

const printPeople = () => {
  console.log('Puhelinluettelo:')
  Person
  .find({})
  .then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}

const [,,name, number] = process.argv

//console.log(name, number)

if(name && number) {
  addToDatabse(name, number)
} else {
  printPeople()
}
