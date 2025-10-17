const mongoose = require('mongoose');

const url = `mongodb+srv://adeshbhongale03:Password@cluster1.xsnemxy.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster1`;

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const name = process.argv[3];
const number = process.argv[4];

mongoose.set('strictQuery', false);
mongoose.connect(url)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);
if (name && number) {
    const person = new Person({
        name,
        number,
    });

person.save().then(result => {
    console.log('person saved!');
    mongoose.connection.close();
}).catch((error) => {
    console.error('Error saving person:', error.message);
});
}else {
    Person.find({}).then(result => {
        console.log('Phonebook:');
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
    }).catch((error) => {
        console.error('Error retrieving persons:', error.message);
    });
}
module.exports = Person;

