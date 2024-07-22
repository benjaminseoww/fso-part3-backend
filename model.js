// set up db
const mongoose = require('mongoose')
require('dotenv').config(); // allow u to get .env variables

const url = process.env.MONGODB_URI
mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{2,3}-\d{6,}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  id: Number
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)