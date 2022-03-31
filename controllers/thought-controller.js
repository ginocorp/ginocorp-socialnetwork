const { Thought, User } = require("../models");

const handleError = (res, err) => {
    console.log(err);
    res.status(500).json({ message: err.message });
};

module.exports = {
    // Get all thoughts
    getThoughts: async (req, res) => {
        try {
            const thoughts = await Thought.find({});
            res.status(200).json(thoughts);
        } catch (err) {
            handleError(res, err);
        }
    },
    // Create thought
    createThought: async (req, res) => {
        try {
            const newThought = await Thought.create(req.body);
            await User.findOneAndUpdate(
                { username: req.body.username },
                { $push: { thoughts: newThought._id } }
            );
            res.status(201).json(newThought);
        } catch (err) {
            handleError(res, err);
        }
    },
    // Get thought by Id
    getThoughtById: async (req, res) => {
        try {
            const thought = await Thought.findOne({
                _id: req.params.thoughtId,
            });
            !thought
                ? res.status(404).json({ message: "Thought not found" })
                : res.status(200).json(thought);
        } catch (err) {
            handleError(res, err);
        }
    },
    // Update thought by Id
    updateThought: async (req, res) => {
        try {
            const updatedThought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body }
            );
            !updatedThought
                ? res.status(404).json({ message: "Thought not found" })
                : res.status(202).json({ message: "Thought updated" });
        } catch (err) {
            handleError(res, err);
        }
    },
    // Delete thought by Id
    deleteThought: async (req, res) => {
        try {
            const thought = await Thought.findOneAndDelete({
                _id: req.params.thoughtId,
            });
            if (!thought) {
                res.status(404).json({ message: "Thought not found" });
            } else {
                await User.findOneAndUpdate(
                    { username: thought.username },
                    { $pull: { thoughts: thought._id } }
                );
                res.status(200).json({ message: "Thought deleted" });
            }
        } catch (err) {
            handleError(res, err);
        }
    },
    // Create reaction and push to thought's reaction array
    createReaction: async (req, res) => {
        try {
            const newReaction = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $push: { reactions: req.body } }
            );
            newReaction
                ? res.status(200).json({ message: "reaction added" })
                : res.status(404).json({ message: "reaction not added" });
        } catch (err) {
            handleError(res, err);
        }
    },
    // Delete reaction's Id from thought's reaction array
    deleteReaction: async (req, res) => {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } }
            );
            !thought
                ? res.status(404).json({ message: "Thought not found" })
                : res.status(200).json({ message: "Reaction deleted" });
        } catch (err) {
            handleError(res, err);
        }
    },
};