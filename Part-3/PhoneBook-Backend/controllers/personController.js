const Person = require('../models/person')

const getAll = async (req, res) => {
  const persons = await Person.find({})
  res.json(persons)
}

const getOne = async (req, res) => {
  const person = await Person.findById(req.params.id)
  if (person) res.json(person)
  else res.status(404).end()
}

const create = async (req, res) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' })
  }
  const person = new Person({ name: body.name, number: body.number })
  const savedPerson = await person.save()
  res.json(savedPerson)
}

const remove = async (req, res) => {
  await Person.findByIdAndRemove(req.params.id)
  res.status(204).end()
}

const update = async (req, res) => {
  const { name, number } = req.body
  const updated = await Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
  res.json(updated)
}

module.exports = { getAll, getOne, create, remove, update }
