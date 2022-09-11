const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongoosePaginate = require('mongoose-paginate')

const TaskSchema = Schema({
    title: String,
    author: { 
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    order: {
        type: Number,
    },
    dateUp: Date,
    dateDown: Date,
    dateUpdate: Date,
    checked: Boolean,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }
})

TaskSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Task', TaskSchema)