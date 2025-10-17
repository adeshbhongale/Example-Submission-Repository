const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person'); // Assuming mongo.js exports the Mongoose model

const app = express();

app.use(cors());
app.use(express.json());

// Custom token to log request body for POST requests
morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

// Use morgan with the custom token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// GET all persons
app.get('/api/persons', async (req, res) => {
    const persons = await Person.find({});
    res.json(persons);
});

// GET info page
app.get('/info', async (req, res) => {
    const count = await Person.countDocuments({});
    const currentTime = new Date();

    res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${currentTime}</p>
    `);
});

// GET one person by ID
app.get('/api/persons/:id', async (req, res) => {
    try {
        const person = await Person.findById(req.params.id);
        if (person) {
            res.json(person);
        } else {
            res.status(404).end();
        }
    } catch (error) {
        res.status(400).json({ error: 'malformatted id' });
    }
});

// POST a new person
app.post('/api/persons', async (req, res) => {
    const { name, number } = req.body;
    if (!name || !number) {
        return res.status(400).json({ error: 'name and number are required' });
    }
    try {
        const person = new Person({ name, number });
        const savedPerson = await person.save();
        res.status(201).json(savedPerson);
    } catch (error) {
        res.status(500).json({ error: 'failed to save person' });
    }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
