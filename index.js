const express = require("express")
const morgan = require("morgan")
const uniqid = require("uniqid")
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 3001
const mongoose = require('mongoose')
const Person = require("./models/person")
mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI

app.use(cors())
app.use(express.json())
app.use(express.static('frontend'))

morgan.token('jsonData', (req, res)=>{ return JSON.stringify(req.body)})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :jsonData"))


app.get("/api/persons",(request, response)=>{
    Person.find().then((result)=>{
        response.send(result);
    })
})

app.post("/api/persons",(request, response)=>{
    let newPerson = new Person({...request.body});
    if(!newPerson.name || !newPerson.number){
        response.status(400).end("Missing name or number")
    }else{
        newPerson.save().then((result)=>{
            response.send(result)
        })
    }
})

app.get("/api/persons/:id",(request, response, next)=>{
    let {id} = request.params;
    Person.findById(id).then((result)=>{
        if(result){
            response.send(result)
        }else{
            response.status(404).end("404 Invalid ID")
        }
    })
    .catch(err=>next(err))
})

app.put("/api/persons/:id",(request, response)=>{
    let {id} = request.params;
    Person.findByIdAndUpdate(id, request.body, {new:true})
    .then((result)=>response.send(result))
})
app.delete("/api/persons/:id",(request, response)=>{
    let {id} = request.params;
    Person.deleteOne({ _id: id}).then(()=>{
        response.status(204).end()
    })
})

app.get("/info",(request, response)=>{
    Person.find().then(result=>{    
    let date = new Date()
    let html = `
        <div>Phonebook has info for ${result.length} people.</div>
        <div>${date}</div>`
        response.send(html)
    })
})

function errorHandler(err,req,res,next){
    if (err.name === "CastError"){
        res.status(400).send("Invalid ID format")
    } else {
        next(err)
    }
}
app.use(errorHandler)

mongoose.connect(url).then(()=>{
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}/`)
    })
})
