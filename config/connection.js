const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://localhost:27017/socialmedia',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => {
        console.log(
            `Connected to Mongo on host: localhost, port: ${mongoose.connection.port}\nUsing socialnetworkapi database`);
    }
);

module.exports = mongoose.connection;