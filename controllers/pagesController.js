const db = require('../config/dbConnection')
const jwt = require('jsonwebtoken')
// const { promisify } = require('util')

exports.homePage = async (req, res) => {

    const comments = await fetch(`http://localhost:5000/comments`).then(data => data.json()).then(data => data.reverse())

    const posts = await fetch(`http://localhost:5000/posts`).then(data => data.json()).then(data => data.reverse())

    const me = req.user

    const likes = await fetch(`http://localhost:5000/likes`).then(data => data.json()).then(data => data)
    const dislike = await fetch(`http://localhost:5000/dislike`).then(data => data.json()).then(data => data)


    res.render('home', {posts, me, comments, likes, dislike})
    
    // db.query('SELECT * FROM post LEFT OUTER JOIN comment ON post.idPost = comment.comment_idPost', async (error, result, next) => {

    //     if(error) {
    //         console.log(error)
    //     } else {
    //         // console.log('result (pagesControllers)', result)
    //         console.log('pagesControllers', 'is launch')
    //         console.log(result)
    //         console.log(comments)
            
    //     }
    // })
}

exports.loginPage = async (req, res) => {
    const me = req.user
    const errMess = ""
    res.render('login', {me,errMess})
}

exports.registerPage = (req, res) => {
    const me = req.user
    const errMess = ""
    res.render('register', {me,errMess})
}
exports.profilePage = (req, res) => {
    const me = req.user
    console.log(me)
    res.render('profile', {me})
}

exports.postPage = (req, res) => {
    const me = req.user
    res.render('createPost', {me})
}



