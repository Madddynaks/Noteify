const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const noteRoutes = require('./routes/notes');


const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI) 
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use('/api/notes', noteRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
