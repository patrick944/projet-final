const bcrypt = require("bcrypt");
const db = require("../config/dbConnection");
const generateToken = require("../jwttools").generateToken

const dotenv = require("dotenv");
dotenv.config({ path: "../.env"});

    module.exports = {
        post : (req, res) => {
    
            const {comment, image,vidéo} = req.body
    
            const postDate = new Date()
    
            const post= {comment, image, vidéo,postDate}
    
                
                db.query('INSERT INTO posts SET ?', post, (error, result) => {
                    if (error) {
                        console.log(error)
                        res.status(401).json({ error : "Operation failed"})
                    } else {
                        res.status(200).json({ message : "Post add"})
                    }
                })
        }, 
        
        getPosts : (req, res) => {
            db.query("SELECT * FROM posts", (error, results) => {
              if (error) {
                console.log(error);
                res.status(500).json({ error: "Failed to retrieve posts" });
              } else {
                res.status(200).json(results);
              }
            });
          },
    
          getPostId : (req, res) => {
            const postId = req.params.id;
          
            db.query("SELECT * FROM posts WHERE id = ?", postId, (error, results) => {
              if (error) {
                console.log(error);
                res.status(500).json({ error: "Failed to retrieve the post" });
              } else if (results.length === 0) {
                res.status(404).json({ error: "Post not found" });
              } else {
                res.status(200).json(results[0]);
              }
            });
          },
    
          updatePostId : (req, res) => {
            const postId = req.params.id;
            const { message, image, vidéo, postDate } = req.body;
            const updatedPost = { message, image, vidéo, postDate  };
          
            db.query(
              "UPDATE posts SET ? WHERE id = ?",
              [updatedPost, postId],
              (error, result) => {
                if (error) {
                  console.log(error);
                  res.status(500).json({ error: "Failed to update the post" });
                } else if (result.affectedRows === 0) {
                  res.status(404).json({ error: "Post not found" });
                } else {
                  res.status(200).json({ message: "Post updated successfully" });
                }
              }
            );
          },
    
          deletePost : (req, res) => {
            const postId = req.params.id;
          
            db.query("DELETE FROM posts WHERE id = ?", postId, (error, result) => {
              if (error) {
                console.log(error);
                res.status(500).json({ error: "Failed to delete the post" });
              } else if (result.affectedRows === 0) {
                res.status(404).json({ error: "Post not found" });
              } else {
                res.status(200).json({ message: "Post deleted successfully" });
              }
            });
          },
    }
