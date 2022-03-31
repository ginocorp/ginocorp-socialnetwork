const dotenv = require("dotenv").config()
const express = require("express");
const db = require("./config/connection");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

// Initiate database and start server
db.once("open", () => {
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
});