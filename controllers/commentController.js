const bcrypt = require("bcrypt");
const db = require("../config/dbConnection");
const generateToken = require("../jwttools").generateToken

const dotenv = require("dotenv");
dotenv.config({ path: "../.env"});

    module.exports = {
        comment : (req, res) => {
    
            const {message, comment_idpost,comment_iduser} = req.body
    
            const commentDate = new Date()
    
            const comment = {message, comment_idpost,comment_iduser, commentDate}
    
                
                db.query('INSERT INTO comments SET ?', comment, (error, result) => {
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
    
          getcommentId : (req, res) => {
            const commentId = req.params.id;
          
            db.query("SELECT * FROM comments WHERE id = ?", commentId, (error, results) => {
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
            const commentId = req.params.id;
            const { message, comment_idpost, comment_iduser, commentDate } = req.body;
            const updatedUser = {  message, comment_idpost, comment_iduser, commentDate };
          
            db.query(
              "UPDATE comments SET ? WHERE id = ?",
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
            const commentId = req.params.id;
          
            db.query("DELETE FROM comment WHERE id = ?", commentId, (error, result) => {
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
    