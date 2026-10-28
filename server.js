const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
app.use(express.json());
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Mongodb connected'))
    .catch(err => console.log(err));
app.use('/api/books', require('./Routes/library'));
app.listen(process.env.PORT || 3000, () => {
    console.log('server running');
});
