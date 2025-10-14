import { useState, useEffect } from 'react'
import personsService from '../persons'
import Notification from './component/Notification'
import Filter from './component/Filter'
import PersonForm from './component/PersonForm'
import Persons from './component/Persons'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({ message: null, type: null })

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(
      person => person.name.toLowerCase() === newName.toLowerCase()
    )
    if (existingPerson) {
      if (window.confirm(
        `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
      )) {
        const updatedPerson = { ...existingPerson, number: newNumber }
        personsService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
            setNotification({ message: `Updated ${returnedPerson.name}'s number`, type: 'success' })
            setTimeout(() => setNotification({ message: null, type: null }), 4000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setNotification({ message: `Information of ${existingPerson.name} has already been removed from server`, type: 'error' })
            setTimeout(() => setNotification({ message: null, type: null }), 4000)
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
      return
    }
    const personObject = {
      name: newName,
      number: newNumber
    }
    personsService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNotification({ message: `Added ${returnedPerson.name}`, type: 'success' })
        setTimeout(() => setNotification({ message: null, type: null }), 4000)
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        setNotification({ message: 'Failed to add person', type: 'error' })
        setTimeout(() => setNotification({ message: null, type: null }), 4000)
      })
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsService.remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          setNotification({ message: `Deleted ${name}`, type: 'success' })
          setTimeout(() => setNotification({ message: null, type: null }), 4000)
        })
        .catch(error => {
          setNotification({ message: `Information of ${name} has already been removed from server`, type: 'error' })
          setTimeout(() => setNotification({ message: null, type: null }), 4000)
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const personsToShow = filter
    ? persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons

  return (
    <div style={{ paddingLeft: 20 }}>
      <h2 style={{ marginTop: 0 }}>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App