if (process.argv.length < 3) {
   console.log('give password as argument')
   process.exit(1)
}

const mongoose = require('mongoose')
mongoose.pluralize(null);
const password = process.argv[2]
const url = `mongodb+srv://wipetmpf3wal:${password}@cluster0.uwvfkir.mongodb.net/phoneBookTest?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)
const personSchema = new mongoose.Schema({
   name: String,
   phone: Number
})
const Person = mongoose.model("PersonsTest", personSchema);
if (process.argv.length === 3) {
   Person.find().then(result=>{
      console.log(result);
      mongoose.connection.close();
   })
} else {
   const newContact = new Person({ name: process.argv[3], phone: process.argv[4] })
   newContact.save().then(result => {
      console.log(`saved ${result.name} (${result.phone}) to database`)
      mongoose.connection.close()
   })
}

