const dotenv = require('dotenv')
dotenv.config()

const mongodb = require('mongodb')

mongodb.connect(process.env.CONNECTIONSTRING, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
    module.exports = client.db() // when we import this file to another file this database will be exported to use in the new file
    const app = require('./app') // we only start the app after we established a connection to the database
    app.listen(process.env.PORT)
})