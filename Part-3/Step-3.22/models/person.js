const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose.connect(url)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        minlength: 8,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{2,3}-\d{5,}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number! Format: XX-XXXXXXX or XXX-XXXXXXX`
        }
    }
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;

