const { Schema, model } = require("mongoose");
const reactionSchema = require("./Reaction");

function formatDate(date) {
    let formattedDate = new Date(date);
    return formattedDate.toDateString();
}

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            get: formatDate,
            default: Date.now,
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);

thoughtSchema.virtual("reactionCount").get(function () {
    return this.reactions.length;
});

module.exports = model("Thought", thoughtSchema);