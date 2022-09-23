const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = Schema({
    username: {
        type: String,
        unique: true,
    },
    initial: Boolean,
    password: String,
    sort: Object,
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    categories: [{ type: Schema.Types.ObjectId, red: 'Category' }]
}) 

module.exports = mongoose.model('User', UserSchema)