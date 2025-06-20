const mongoose = require('mongoose');

//database connection
function connectedDB() {
    mongoose.connect(
        "mongodb://localhost:27017/"
    ).then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.log('Error connecting to MongoDB: ', err);
    })
}

//export database
module.exports = connectedDB;