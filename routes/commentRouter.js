const express = require('express');
const commentCtrl = require('../controllers/commentController');
const commentsRouter = express.Router();

///////////////////////////////// COMMENT ///////////////////////////////////////////////
// comment a post
commentsRouter.post("/", commentCtrl.comment);
// get all comments
commentsRouter.get("/", commentCtrl.getComments);
// get a comment
commentsRouter.get("/:id", commentCtrl.getcommentId);
// update a comment
commentsRouter.put("/:id", commentCtrl.updateCommentId);
// delete a comment
commentsRouter.delete("/:id", commentCtrl.deleteComment);

module.exports = commentsRouter