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
app.get('/api/persons/:id', async (req, res, next) => {
    try {
        const person = await Person.findById(req.params.id);
        if (person) {
            res.json(person);
        } else {
            res.status(404).end();
        }
    } catch (error) {
        next(error);
    }
});

// POST a new person
app.post('/api/persons', async (req, res, next) => {
    const { name, number } = req.body;
    if (!name || !number) {
        return res.status(400).json({ error: 'name and number are required' });
    }
    try {
        const person = new Person({ name, number });
        const savedPerson = await person.save();
        res.status(201).json(savedPerson);
    } catch (error) {
        next(error);
    }
});

// DELETE a person by id
app.delete('/api/persons/:id', async (req, res, next) => {
    try {
        const result = await Person.findByIdAndDelete(req.params.id);
        if (result) {
            res.status(204).end();
        } else {
            res.status(404).json({ error: 'person not found' });
        }
    } catch (error) {
        next(error);
    }
});


// Error handler middleware
app.use((error, req, res, next) => {
    if (error.name === 'CastError') {
        return res.status(400).json({ error: 'malformatted id' });
    }
    if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message || 'Internal server error' });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
