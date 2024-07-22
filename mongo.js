const mongoose = require('mongoose')
require('dotenv').config(); // allow u to get .env variables

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://benfullstackseow:${password}@cluster0.n5w9g2c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length==5) {
    const name = process.argv[3];
    const number = process.argv[4];

    //adding 
    const person = new Person({
        name: name,
        number: number,
        id: Math.floor(Math.random() * 1000)
    })

    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
} else if (process.argv.length==3) {
    // fetching
    Person.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })  
}



