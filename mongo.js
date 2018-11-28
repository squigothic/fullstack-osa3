const mongoose = require('mongoose')
const Person = require('./modules/person')

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
      console.log(result)
      console.log('-------')
      result.forEach(person => console.log(Person.format(person)))
      mongoose.connection.close()
    })
/*   const persons =
    Person
      .find({})
      .then(result => {
        console.log(result)
        mongoose.connection.close()
      })
  console.log(persons) */
}

const [,,name, number] = process.argv

//console.log(name, number)

if(name && number) {
  addToDatabse(name, number)
} else {
  printPeople()
}
