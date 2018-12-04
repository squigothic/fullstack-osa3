const mongoose = require('mongoose')
if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.DB_HOST

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.statics.format = function(person) {
  return {
    id: person._id,
    name: person.name,
    number: person.number
  }
}

const Person = mongoose.model('Person', personSchema)


module.exports = Person