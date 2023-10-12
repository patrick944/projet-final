const bcrypt = require("bcrypt");
const db = require("../config/dbConnection");
const generateToken = require("../jwttools").generateToken

const dotenv = require("dotenv");
dotenv.config({ path: "../.env"});

    module.exports = {
        comment : (req, res) => {
    
        const {comment, comment_idpost,comment_iduser} = req.body
        const commentDate = new Date()
        const comments = {comment, comment_idpost,comment_iduser, commentDate}
            
            db.query('INSERT INTO comments SET ?', comments, (error, result) => {
                if (error) {
                    console.log(error)
                    res.status(401).json({ error : "Operation failed"})
                } else {
                    res.status(200).json({ message : "comment add"})
                }
            })
        },
        getComments : (req, res) => {
            db.query("SELECT * FROM comments", (error, results) => {
              if (error) {
                console.log(error);
                res.status(500).json({ error: "Failed to retrieve comments" });
              } else {
                res.status(200).json(results);
              }
            });
          },
    
          getCommentId : (req, res) => {
            const commentId = req.params.id;
          
            db.query("SELECT * FROM comments WHERE idcomment = ?", commentId, (error, results) => {
              if (error) {
                console.log(error);
                res.status(500).json({ error: "Failed to retrieve the comment" });
              } else if (results.length === 0) {
                res.status(404).json({ error: "Comment not found" });
              } else {
                res.status(200).json(results[0]);
              }
            });
          },
    
          updateCommentId : (req, res) => {
            const commentId = req.query.idcomment;
            const { comment } = req.body;
            const updatedComment = {  comment };
          
            db.query(
              "UPDATE comments SET ? WHERE idcomment = ?",
              [updatedComment, commentId],
              (error, result) => {
                if (error) {
                  console.log(error);
                  res.status(500).json({ error: "Failed to update the comment" });
                } else if (result.affectedRows === 0) {
                  res.status(404).json({ error: "Comment not found" });
                } else {
                  res.status(200).json({ message: "Comment updated successfully" });
                }
              }
            );
          },
    
          deleteComment : (req, res) => {
            const commentId = req.query.idcomment;
          
            db.query("DELETE FROM comments WHERE idcomment = ?", commentId, (error, result) => {
              if (error) {
                console.log(error);
                res.status(500).json({ error: "Failed to delete the comment" });
              } else if (result.affectedRows === 0) {
                res.status(404).json({ error: "Comment not found" });
              } else {
                res.status(200).json({ message: "Comment deleted successfully" });
              }
            });
          },
    
    }
    