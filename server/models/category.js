const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = Schema({
    title: {
        type: String,
        unique: true,
    },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
})

module.exports = mongoose.model('Category', CategorySchema)