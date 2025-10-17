const Persons = ({ persons, handleDelete }) => (
  <ul>
    {persons.map(person => (
      <li key={person._id || person.id || `${person.name}-${person.number}`}>
        {person.name} {person.number} {' '}
        <button onClick={() => handleDelete(person._id || person.id, person.name)}>
          delete
        </button>
      </li>
    ))}
  </ul>
)

export default Persons
