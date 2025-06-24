const mongoose = require('mongoose');
const routes = require('../routes');

//database connection

const connectedDB = mongoose.connect(
    "mongodb://127.0.0.1:27017/ECOM"
).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Error connecting to MongoDB: ', err);
});


//export database
module.exports = connectedDB;