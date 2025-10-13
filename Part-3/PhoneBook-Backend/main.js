const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(cors())
app.use(express.json())

let persons = []

// Fetch initial data from frontend db.json
axios.get('http://localhost:3000/persons')
    .then(response => {
        persons = response.data
        console.log('Fetched persons from frontend db.json')
    })
    .catch(error => {
        console.error('Error fetching persons from frontend db.json:', error.message)
    })

// Get all persons
app.get('/persons', (req, res) => {
    res.json(persons)
})

// Get a single person
app.get('/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    } else {
    const mongoose = require('mongoose')
    const personsRouter = require('./routes/persons')

        res.status(404).end()
    }
})

    const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/phonebook'
    mongoose.connect(mongoUrl)


// Delete a person
app.delete('/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

// Add a new person
app.post('/persons', async (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'name or number missing' })
    }

    if (persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())) {
        return res.status(400).json({ error: 'name must be unique' })
    }

    // Generate a new id: one greater than the current max id, or 1 if empty
    const maxId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) : 0
    const person = {
        id: maxId + 1,
        name: body.name,
        number: body.number
    }

    try {
        // Add to frontend db.json via POST request
        await axios.post('http://localhost:3000/persons', person)
        persons = persons.concat(person)
        res.json(person)
    } catch (error) {
        res.status(500).json({ error: 'Failed to add person to db.json' })
    }
})

// Update a person
app.put('/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const body = req.body

    const person = persons.find(p => p.id === id)
    if (!person) {
        return res.status(404).json({ error: 'person not found' })
    }

    const updatedPerson = { ...person, number: body.number }
    persons = persons.map(p => p.id !== id ? p : updatedPerson)
    res.json(updatedPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})