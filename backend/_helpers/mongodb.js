const mongoose = require('mongoose');
// const url = 'mongodb://localhost:27017/devlogs';

async function connect() {
    // protocol://username:password@host:port/db_name
    mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Mongo Connected'))
        .catch((err => { console.log('Mongo', err); }))
}

const logSchema = new mongoose.Schema({
    requestBody: { type: Object },
    responceBody: { type: Object },
    method: { type: String },
    url: { type: String }
})
const logs = new mongoose.model("logs", logSchema)

async function ceatelogs(data) {
    const createlog = new logs(data)
    await createlog.save()
}

module.exports = { connect, ceatelogs };