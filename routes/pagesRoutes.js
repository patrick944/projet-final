const express = require('express');
const app = express.Router();
const pagesCTRL = require('../controllers/pagesController')
const userCTRL = require('../controllers/userController')
const postCTRL = require('../controllers/postController')
const commentCTRL = require('../controllers/commentController')
const db = require('../config/dbConnection')

app.get('/', userCTRL.isLoggedIn, pagesCTRL.homePage)

app.get('/login', pagesCTRL.loginPage)

app.get('/register',  pagesCTRL.registerPage)

app.get('/article', userCTRL.isLoggedIn, pagesCTRL.articlePage)

// app.get('/post', userCTRL.isLoggedIn, pagesCTRL.postPage)
app.get('/profile', userCTRL.isLoggedIn, pagesCTRL.profilePage)
// app.post('/profile',  userCTRL.isLoggedIn, userCTRL.updateUserById)
app.get('/delete-user', userCTRL.isLoggedIn, userCTRL.deleteUser)

// update Post
app.get('/updatePost', userCTRL.isLoggedIn, pagesCTRL.showUpdatePost)
// app.post('/updatePost', userCTRL.isLoggedIn, postCTRL.updatePostId)

// update Comment
app.get('/updateComment', userCTRL.isLoggedIn, pagesCTRL.showUpdateComment)
// app.post('/updateComment', userCTRL.isLoggedIn, commentCTRL.updateCommentId)

// app.get('/comment/:id', pagesCTRL.commentPage)

module.exports = app;