const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const postController = require('./controllers/postController')

// User Related Routes

router.get('/', userController.home)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/logout', userController.logout)

// Post Related Routes
router.get('/create-post',userController.mustBeLoggedIn, postController.viewCreateScreen)

module.exports = router