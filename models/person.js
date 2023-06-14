 const mongoose = require("mongoose")
 mongoose.pluralize(null);
 const personSchema = new mongoose.Schema({
    name: String,
    number: Number
 })
 personSchema.set('toJSON', {
   transform: (document, returnedObject) => {
     returnedObject.id = returnedObject._id.toString()
     delete returnedObject._id
     delete returnedObject.__v
   }
 })
module.exports = mongoose.model("PersonsTest", personSchema);