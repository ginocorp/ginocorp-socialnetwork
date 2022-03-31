const { User, Thought } = require("../models");

const handleError = (res, err) => {
    console.log(err);
    res.status(500).json({ message: err.message });
};

module.exports = {
    // Get all users
    getUsers: async (req, res) => {
        try {
            const users = await User.find({});
            res.status(200).json(users);
        } catch (err) {
            handleError(res, err);
        }
    },
    // Get user by Id
    getUserById: async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.params.userId });
            !user
                ? res.status(404).json({ message: `User not found` })
                : res.status(200).json(user);
        } catch (err) {
            handleError(res, err);
        }
    },
    // Update user by Id
    updateUser: async (req, res) => {
        try {
            const updatedUser = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body }
            );
            !updatedUser
                ? res.status(404).json({ message: "User not found" })
                : res.status(202).json({ message: "User updated" });
        } catch (err) {
            handleError(res, err);
        }
    },
    // Delete user by id
    deleteUser: async (req, res) => {
        try {
            // Validate user exists
            const user = await User.findOneAndDelete({
                _id: req.params.userId,
            });
            !user
                ? res.status(404).json({ message: "User not found" })
                : // Delete from thoughts based on deleted user's thought Id array
                  await Thought.deleteMany({ _id: { $in: user.thoughts } });
            res.status(200).json({
                message: "User and user's thoughts have been deleted",
            });
        } catch (err) {
            handleError(res, err);
        }
    },
    // Create user
    createUser: async (req, res) => {
        try {
            const newUser = await User.create(req.body);
            res.status(201).json(newUser);
        } catch (err) {
            handleError(res, err);
        }
    },
    // Add user id to other user's friends array
    addFriend: async (req, res) => {
        try {
            // Check if friend exists as user
            const friend = await User.findOne({ _id: req.params.friendId });
            if (!friend) {
                res.status(404).json({
                    message: "invalid user to be added as friend",
                });
                return;
            }

            // Check if friend id is in user's friends array
            const alreadyFriends = await User.findOne({
                _id: req.params.userId,
                friends: req.params.friendId,
            });

            // Check if friend Id already exists in user.friends array
            if (alreadyFriends) {
                console.log("already friends");
                res.status(400).json({ message: "Already friends" });
            } else {
                const user = await User.findOneAndUpdate(
                    { _id: req.params.userId },
                    { $push: { friends: req.params.friendId } }
                );
                !user
                    ? res.status(404).json({ message: "User not found" })
                    : res.status(200).json({ message: "Friend added" });
            }
        } catch (err) {
            handleError(res, err);
        }
    },
    // Remove user's id from other user's friend array
    deleteFriend: async (req, res) => {
        try {
            // Confirm that users are friends
            const checkFriend = await User.findOne({
                _id: req.params.userId,
                friends: req.params.friendId,
            });
            // If friends, remove id from friends array
            if (checkFriend) {
                await User.findOneAndUpdate(
                    { _id: req.params.userId },
                    { $pull: { friends: req.params.friendId } }
                );
                res.status(200).json({ message: "Friend removed" });
            } else {
                res.status(400).json({ message: "Users are not friends" });
            }
        } catch (err) {
            handleError(res, err);
        }
    },
};