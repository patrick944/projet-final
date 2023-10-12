const db = require('../config/dbConnection')
const jwt = require('jsonwebtoken')
// const { promisify } = require('util')

exports.homePage = async (req, res) => {
      // const comments = await fetch(`http://localhost:5000/comments`).then(data => data.json()).then(data => data.reverse())
    const me = req.user
    
    const succMess = ''

    const errMess = ''

    const posts = await fetch(`http://localhost:5000/posts`).then(data => data.json()).then(data => data.reverse())

    const comments = ''

    const likes = await fetch(`http://localhost:5000/likes`).then(data => data.json()).then(data => data.reverse())

    const dislikes = await fetch(`http://localhost:5000/dislikes`).then(data => data.json()).then(data => data)

    const follows = ''

    res.render('home', {me, errMess, posts, likes, dislikes})
      
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
    // }
  }

  exports.articlePage = async (req, res) => {
      const idpost = req.query.idpost
      console.log('------ID-------', idpost);
      const me = req.user

      const comments = await fetch(`http://localhost:5000/comments`).then(data => data.json()).then(data => data.reverse())
      
      const users = await fetch(`http://localhost:5000/users`).then(data => data.json()).then(data => data.reverse())

      const post = await fetch(`http://localhost:5000/post/${idpost}`).then(data => data.json())

      res.render('article', {post, me, comments, users})
  }
  exports.loginPage = async (req, res) => {
      const user = req.user
      const errMess = ""
      if (user) {
          res.redirect("/profile");
        } else {
          res.render('login', {errMess})
        }
}

exports.registerPage = (req, res) => {
    const me = req.user
    const errMess = ""
    res.render('register', {me,errMess})
}

exports.profilePage = (req, res) => {
    const user = req.user
    if (user) {
        res.render("profile", { user });
      } else {
        res.render("login");
      }
}

exports.showUpdatePost = async (req, res) => {

  const idpost = req.query.id

  const post = await fetch(`http://localhost:5000/post/${idpost}`).then(data => data.json())
  res.render('updatePost', {post})

}

exports.showUpdateComment = async (req, res) => {

  const idcomment = req.query.idcomment

  const comment = await fetch(`http://localhost:5000/comment/${idcomment}`).then(data => data.json())
  res.render('updateComment', {comment})

}

// exports.updatePostFetch = async (req, res) => {
//   const id = req.query.id;
//   const body = req.body;
//   console.log('PAGECONTROLLER',id);

//   const me = req.user
  
//   const posts = await fetch(`http://localhost:5000/posts`).then(data => data.json()).then(data => data.reverse())

//   const likes = await fetch(`http://localhost:5000/likes`).then(data => data.json()).then(data => data.reverse())

//   const dislikes = await fetch(`http://localhost:5000/dislikes`).then(data => data.json()).then(data => data)

//   const comments = ''

//   res.render('updatePost')
// }


// exports.postPage = (req, res) => {
//     const me = req.user.id
//     res.render('createPost', {me})
// }



