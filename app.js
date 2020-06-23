const express = require('express')
const app = express()

app.use(express.static('public'))
app.set('views', 'views') // the first argument has to be 'views', but the second argument should be the name of the folder of our view files, .ejs files
app.set('view engine', 'ejs') // we have to let express know which template engine or templating system we are using

app.get('/', function(req, res) {
    res.render('home-guest')
})

app.listen(3000)