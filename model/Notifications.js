const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    inconn_id: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    outconn_id: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    post_id: {
        type: mongoose.Types.ObjectId,
        ref: "Feeds"
    },
    activity: {
        type: String,
    },
    status: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    seen: {
        type: Boolean
    }
});

module.exports = mongoose.model('Notifications', notificationSchema, 'notifications');
