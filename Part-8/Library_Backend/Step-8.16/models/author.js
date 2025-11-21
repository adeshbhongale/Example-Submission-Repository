import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minlength: 3 },
  born: { type: Number }
})

authorSchema.plugin(uniqueValidator)
export default mongoose.model('Author', authorSchema)
