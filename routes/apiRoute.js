const express = require('express');
const userCtrl = require('../controllers/userController');
const likeCtrl = require('../controllers/likeController');
const postCtrl = require('../controllers/postController');
const commentCtrl = require('../controllers/commentController');
const dislikeCtrl = require('../controllers/dislikeController');
const userRouter = express.Router();
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        const now = Date.now()
        const fileName = file.originalname.replace(path.extname(file.originalname), '') + '_' + now + path.extname(file.originalname)
        cb(null, fileName)
        req.filename = fileName
    }
})

const upload = multer({ storage: storage})

//const jwttools = require("../jwttools");
// const db = require("../config/dbConnection");
// const router = express.Router();

        
    

    ///////////////////////////////// USER ///////////////////////////////////////////////
        // Create a new user
    userRouter.post("/user", userCtrl.register);

    // Retrieve all users (protected route)
    userRouter.get("/users", userCtrl.getUsers);

    // Retrieve a specific user (protected route)
    userRouter.get("/user/:id", userCtrl.getUserById);

    // Update a user (protected route)
    userRouter.put("/user/:id", userCtrl.updateUserById);
    userRouter.post('/profile',  userCtrl.isLoggedIn, userCtrl.updateUserById)


    // Delete a user (protected route)
    userRouter.delete("/user/:id", userCtrl.deleteUser);

    // Login route
    userRouter.post("/login" ,  userCtrl.loginUser);
    userRouter.post("/logout" , userCtrl.Userlogout);

  
///////////////////////////////// LIKE ///////////////////////////////////////////////

    // Like a post
    userRouter.get("/likes", likeCtrl.likes);
    userRouter.post("/like", likeCtrl.like);
/////////////////////////////// DISLIKE /////////////////////////////////////////////
    // dislike a post
    userRouter.get("/dislikes", dislikeCtrl.getDislikes);
    userRouter.post("/dislike", dislikeCtrl.dislike);

    ///////////////////////////////// POST ///////////////////////////////////////////////
    // send a post
    userRouter.post("/post", upload.single('avatar'), postCtrl.post);
    // GET ALL POSTS
    userRouter.get("/posts", postCtrl.getPosts);
    // get a post
    userRouter.get("/post/:id", postCtrl.getPostId);
    // update a post
    userRouter.post('/updatePost', userCtrl.isLoggedIn, postCtrl.updatePostId)
    // delete a post
    userRouter.get("/delete-post", postCtrl.deletePost);
    ///////////////////////////////// COMMENT ///////////////////////////////////////////////
    // send a comment
    userRouter.post("/comment", commentCtrl.comment);
    // GET ALL COMMENTS
    userRouter.get("/comments", commentCtrl.getComments);
    // get a comment
    userRouter.get("/comment/:id", commentCtrl.getCommentId);
    // update a comment
    userRouter.post('/update-comment', userCtrl.isLoggedIn, commentCtrl.updateCommentId)
    // delete a comment
    userRouter.get("/delete-comment", commentCtrl.deleteComment);

    module.exports = userRouter