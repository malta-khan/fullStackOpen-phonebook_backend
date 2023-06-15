 const mongoose = require("mongoose")
 mongoose.pluralize(null);
 const personSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minLength: 3,
    },
    number: {
      type: String,
      validate: {
        validator: (v) => {
          return /^\d{2,3}-\d{6,}$/.test(v);
        },
        message: "Invalid phone number format."
      }
    }
 })
 personSchema.set('toJSON', {
   transform: (document, returnedObject) => {
     returnedObject.id = returnedObject._id.toString()
     delete returnedObject._id
     delete returnedObject.__v
   }
 })
module.exports = mongoose.model("PersonsTest", personSchema);
