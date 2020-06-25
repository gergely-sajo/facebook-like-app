const mongodb = require('mongodb')

const connectionString = 'mongodb+srv://todoAppUser:DvrvofqVJIDajxUg@cluster0.uwuq3.mongodb.net/ComplexApp?retryWrites=true&w=majority'

mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
    module.exports = client.db() // when we import this file to another file this database will be exported to use in the new file
    const app = require('./app') // we only start the app after we established a connection to the database
    app.listen(3000)
})