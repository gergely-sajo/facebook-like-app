const apiRouter = require('express').Router()
const cors = require('cors') // Cross Origin Resource Sharing. 
const userController = require('./controllers/userController')
const postController = require('./controllers/postController')
const followController = require('./controllers/followController')

apiRouter.use(cors()) // We have to explicitly say that it is okay to receive api requests. Webbrowser doesnt send off asynchronous requests to other domains unless that other domain explicitly say its okay 

apiRouter.post('/login', userController.apiLogin)
apiRouter.post('/create-post', userController.apiMustBeLoggedIn, postController.apiCreate)
apiRouter.delete('/post/:id', userController.apiMustBeLoggedIn, postController.apiDelete)
apiRouter.get('/postsByAuthor/:username', userController.apiGetPostsByUsername)

module.exports = apiRouter