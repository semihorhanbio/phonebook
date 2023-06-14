import persons from './data.js'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

const PORT = process.env.PORT || 3001
const app = express()

morgan.token('data', (req, res) => JSON.stringify(req.body))

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :data'))

app.get('/info', (req, res) => {
    res.send(
        `<p>
            Phone has info for ${persons.length} people <br/>
            ${new Date().toUTCString()}
        </p>`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.post('/api/persons', (req, res) => {
    const person = req.body
    if(!person.name || persons.find(p => p.name === person.name)) {
        res.status(404).json({ error: 'name must be unique' })
        return
    }

    person.id = Math.floor(Math.random() * 100000)
    persons.push(person)

    res.json(person)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    person ? res.json(person) : res.sendStatus(404)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const newPersons = persons.filter(p => p.id !== id)

    res.sendStatus(204)
})

app.listen(PORT, () => console.log('Listening on port', PORT))