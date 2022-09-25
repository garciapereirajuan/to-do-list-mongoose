const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongoosePaginate = require('mongoose-paginate')

const TaskSchema = Schema({
    title: String,
    author: { 
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    orderByDateDown: Date,
    orderByCategory: String,
    dateUp: Date,
    dateDown: Date,
    timeDateDown: Date,
    dateUpdate: Date,
    dateComplete: Date,
    checked: Boolean,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }
})

TaskSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Task', TaskSchema)