import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true, minlength: 5 },
  published: Number,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  genres: [String]
})

bookSchema.plugin(uniqueValidator)

export default mongoose.model('Book', bookSchema)
