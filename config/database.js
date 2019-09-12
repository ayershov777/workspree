const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://application:xhHRZYVYUJrjhhTO@cluster0-ki1w3.mongodb.net/job-listing-site?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const db = mongoose.connection;
db.on('connected', () => {
    console.log(`mongoose connected to database at ${db.host}:${db.port}`);
});
