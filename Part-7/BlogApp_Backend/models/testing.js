const mongoose = require('mongoose')

const testingSchema = new mongoose.Schema({
  action: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  details: mongoose.Schema.Types.Mixed // for any extra info
})

const Testing = mongoose.model('Testing', testingSchema)

module.exports = Testing
