const { Schema, Types } = require("mongoose");

function formatDate(date) {
    let formattedDate = new Date(date);
    return formattedDate.toDateString();
}

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            maxLength: 280,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: formatDate,
        },
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        _id: false,
    }
);

module.exports = reactionSchema;