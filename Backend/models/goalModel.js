const mongoose = require('mongoose');

const goalSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
        // ref is added so as to refer to the user model because we are creating the user identification.
    },
    text: {
        type: String,
        required:[true,'Please add a text value']
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Goal', goalSchema);