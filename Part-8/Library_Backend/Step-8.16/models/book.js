import mongoose from "mongoose"

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  published: { type: Number, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true
  },
  genres: [{ type: String }]
})

export default mongoose.model("Book", bookSchema)
