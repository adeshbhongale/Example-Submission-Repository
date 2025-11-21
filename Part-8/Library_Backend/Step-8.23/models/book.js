import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  author: {
    type: String,
    required: true
  },
  published: {
    type: Number,
    required: true
  },
  genres: [
    {
      type: String,
      required: true
    }
  ]
})

bookSchema.plugin(uniqueValidator)

export default mongoose.model('Book', bookSchema);