const dotenv = require('dotenv')
dotenv.config()
const app = require('./app')
const PORT = 3003 || process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})