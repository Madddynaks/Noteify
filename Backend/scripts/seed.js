const mongoose = require('mongoose');
const Note = require('../models/Note');
require('dotenv').config();

const dummyData = [
    {
        group: 'Work',
        text: 'Complete the project report by Monday.',
        color: 'bg-red-500',
        position: { x: 100, y: 100 }
    },
    {
        group: 'Personal',
        text: 'Buy groceries: milk, bread, eggs.',
        color: 'bg-green-500',
        position: { x: 200, y: 150 }
    },
    {
        group: 'Work',
        text: 'Schedule a meeting with the team for Thursday.',
        color: 'bg-blue-500',
        position: { x: 300, y: 200 }
    },
    {
        group: 'Personal',
        text: 'Go for a run in the park.',
        color: 'bg-yellow-500',
        position: { x: 400, y: 250 }
    },
    {
        group: 'Miscellaneous',
        text: 'Read the new book on JavaScript frameworks.',
        color: 'bg-purple-500',
        position: { x: 500, y: 300 }
    }
];

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('MongoDB connected');
        await Note.deleteMany({});
        await Note.insertMany(dummyData);
        console.log('Dummy data inserted');
        mongoose.disconnect();
    })
    .catch(err => console.log(err));
