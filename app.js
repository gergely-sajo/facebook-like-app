const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const markdown = require('marked')
const app = express()
const sanitizeHTML = require('sanitize-html')

// Session Configuration Options
let sessionOptions = session({
    secret: "verysecretsecret",
    store: new MongoStore({client: require('./db')}),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // one day
        httpOnly: true
    }
})

app.use(sessionOptions)
app.use(flash())

// adding a 'user' object to the local ejs object of 'locals'. so every ejs template has access to the 'user' object
app.use(function(req, res, next) {
    // make the markdown function available within the ejs templates
    res.locals.filterUserHTML = function(content) {
        return sanitizeHTML(markdown(content), {allowedTags: ['p', 'br', 'ul', 'ol', 'li', 'strong', 'bold', 'i', 'em', 'h1', 'h2', 'h3', 'h4'], allowedAttributes: {}})
    }

    // make all error and success flash messages available from all templates
    res.locals.errors = req.flash("errors")
    res.locals.success = req.flash("success")

    // make current user id available on the req object
    if (req.session.user) {req.visitorId = req.session.user._id} else {req.visitorId = 0}

    // make user session data available from within view templates
    res.locals.user = req.session.user
    next()
})

const router = require('./router')

app.use(express.urlencoded({extended: false})) // have toconfigure the express app for the userController to be able to understand the input. It basically only tells express to add the user-submitted data onto our request object
app.use(express.json())

app.use(express.static('public'))
app.set('views', 'views') // the first argument has to be 'views', but the second argument should be the name of the folder of our view files, .ejs files
app.set('view engine', 'ejs') // we have to let express know which template engine or templating system we are using

app.use('/', router)

// we have to configure the server to be an express app and to power socket connections at the same time
const server = require('http').createServer(app)

const io = require('socket.io')(server)

io.on('connection', function() {
    console.log("A new user connected")
})

module.exports = server // we dont start our app from this file anymore, just exporting the express app, therefore the db.js file can start the app after the connection to the database is established
