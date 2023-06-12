let data = require("./data.json")
const express = require("express")
const morgan = require("morgan")
const uniqid = require("uniqid")
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
morgan.token('jsonData', (req, res)=>{ return JSON.stringify(req.body)})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :jsonData"))

app.get("/",(request, response)=>{
    let html = `
    <div>Nothing much on this page, here are some links to other pages</div>
    <div><a href="/info">/info</a></div>
    <div><a href="/api/persons">/api/persons</a></div>`
    response.send(html)
})

app.get("/api/persons",(request, response)=>{
    response.send(data)
})

app.post("/api/persons",(request, response)=>{
    let newPerson = {...request.body};
    let duplicate = data.find(person => person.name === newPerson.name);
    if(duplicate){
        response.status(400).end(`${newPerson.name} is already added to the phonebook.`)
    }else if(!newPerson.name || !newPerson.number){
        response.status(400).end("Missing name or number")
    }else{
        newPerson.id = uniqid()
        data = data.concat(newPerson)
        response.send(newPerson)
    }
})

app.get("/api/persons/:id",(request, response)=>{
    let {id} = request.params;
    let person = data.find(person=> person.id.toString() === id.toString())
    if(person){
        response.send(person)
    }else{
        response.statusMessage = "Invalid ID";
        response.status(404).end("404 Invalid ID")
    }
})

app.delete("/api/persons/:id",(request, response)=>{
    let {id} = request.params;
    data = data.filter(person=> person.id.toString() !== id.toString())
    response.status(204).end()
})

app.get("/info",(request, response)=>{
    let date = new Date()
    let html = `
    <div>Phonebook has info for ${data.length} people.</div>
    <div>${date}</div>`
    response.send(html)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`)
})