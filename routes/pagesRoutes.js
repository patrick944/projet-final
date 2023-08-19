const express = require('express');
const app = express.Router();
const pagesCTRL = require('../controllers/pagesController')
const userCTRL = require('../controllers/userController')
const db = require('../config/dbConnection')

app.get('/', userCTRL.isLoggedIn, pagesCTRL.homePage)

app.get('/login', userCTRL.isLoggedIn, pagesCTRL.loginPage)

app.get('/register', userCTRL.isLoggedIn, pagesCTRL.registerPage)

app.get('/post', userCTRL.isLoggedIn, pagesCTRL.postPage)
app.get('/profile', userCTRL.isLoggedIn, pagesCTRL.profilePage)

// app.get('/comment/:id', pagesCTRL.commentPage)

module.exports = app;