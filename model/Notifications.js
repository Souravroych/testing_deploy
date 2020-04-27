const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    inconn_id:{
        type: String
    },
    outconn_id:{
        type: String
    },
    post_id: {
        type: String,
    },
    comment: {
        type: Boolean
    },
    like: {
        type: Boolean
    },
    status:{
        type:String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notifications', userSchema, 'notifications');