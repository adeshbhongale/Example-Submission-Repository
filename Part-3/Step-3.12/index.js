const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./mongo');

const app = express();

app.use(cors());
app.use(express.json());

// Custom token to log request body for POST requests
morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

// Use morgan with the custom token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
