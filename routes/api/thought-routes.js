const router = require("express").Router();
const { Router } = require("express");
const {
    getThoughts,
    getThoughtById,
    updateThought,
    deleteThought,
    createThought,
    createReaction,
    deleteReaction,
} = require("../../controllers/thought-controller");

router.route("/").get(getThoughts).post(createThought);

router.route("/:thoughtId").get(getThoughtById).put(updateThought).delete(deleteThought);

router.post("/:thoughtId/reactions", createReaction);

router.delete("/:thoughtId/reactions/:reactionId", deleteReaction);

module.exports = router;