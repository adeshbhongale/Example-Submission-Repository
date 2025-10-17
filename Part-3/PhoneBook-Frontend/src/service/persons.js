import axios from 'axios'

const baseUrl = 'https://example-submission-repository.onrender.com/api/persons'

const getAll = async () => {
    const res = await axios.get(baseUrl)
    return res.data
}

const create = async newPerson => {
    const res = await axios.post(baseUrl, newPerson)
    return res.data
}

const remove = async id => {
    await axios.delete(`${baseUrl}/${id}`)
}

const update = async (id, newPerson) => {
    const res = await axios.put(`${baseUrl}/${id}`, newPerson)
    return res.data
}

export default { getAll, create, remove, update }
