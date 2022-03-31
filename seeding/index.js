const dotenv = require("dotenv");
const connection = require("../config/connection");
const { User, Thoughts } = require("../models");
const { userData, thoughtSeeds } = require("./seeding");

const seedThoughts = async () => {
    for (const thought of thoughtSeeds) {
        const createThought = await Thoughts.create(thought);
        await User.findOneAndUpdate(
            { username: createThought.username },
            { $push: { thoughts: createThought._id } }
        );
    }
};

const seedFriendList = async () => {
    const friend = await User.find({}).select("_id");
    for (const id of friend) {
        await User.findOneAndUpdate(
            { _id: id },
            { $push: { friends: friend.filter(friend => friend !== id) } }
        );
    }
};

connection.on("error", err => err);

connection.once("open", async () => {
    await User.deleteMany({});
    await Thought.deleteMany({});

    await User.collection.insertMany(userData);
    console.log("USERS HAVE BEEN SEEDED");
    await seedThoughts();
    console.log("THOUGHTS HAVE BEEN SEEDED");
    await seedFriendList();
    console.log("FRIENDS HAVE BEEN SEEDED");
    process.exit(0);
});
