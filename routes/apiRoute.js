const express = require('express');
const userCtrl = require('../controllers/userController');
const likeCtrl = require('../controllers/likeController');
const postCtrl = require('../controllers/postController');
const dislikeCtrl = require('../controllers/dislikeController');
const userRouter = express.Router();

//const jwttools = require("../jwttools");
// const db = require("../config/dbConnection");
// const router = express.Router();

        
    

    ///////////////////////////////// USER ///////////////////////////////////////////////
        // Create a new user
    userRouter.post("/user", userCtrl.addUser);

    // Retrieve all users (protected route)
    userRouter.get("/users", userCtrl.getUsers);

    // Retrieve a specific user (protected route)
    userRouter.get("/user/:id", userCtrl.getUserId);

    // Update a user (protected route)
    userRouter.put("/user/:id", userCtrl.updateUserId);

    // Delete a user (protected route)
    userRouter.delete("/user/:id", userCtrl.deleteUser);

    // Login route
    userRouter.post("/login" , userCtrl.loginUser);
  
///////////////////////////////// LIKE ///////////////////////////////////////////////

    // Like a post
    userRouter.get("/likes", likeCtrl.likes);
    userRouter.post("/like", likeCtrl.like);
/////////////////////////////// DISLIKE /////////////////////////////////////////////
    // dislike a post
    userRouter.get("/dislike", dislikeCtrl.dislike);
    userRouter.post("/dislike", dislikeCtrl.dislike);

    ///////////////////////////////// POST ///////////////////////////////////////////////
    // send a post
    userRouter.post("/post", postCtrl.post);
    // GET ALL POSTS
    userRouter.get("/posts", postCtrl.getPosts);
    // get a post
    userRouter.get("/post/:id", postCtrl.getPostId);
    // update a post
    userRouter.put("/post/:id", postCtrl.updatePostId);
    // delete a post
    userRouter.delete("/post/:id", postCtrl.deletePost);


    module.exports = userRouter