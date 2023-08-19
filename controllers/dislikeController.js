const bcrypt = require("bcrypt");
const db = require("../config/dbConnection");
const generateToken = require("../jwttools").generateToken

const dotenv = require("dotenv");
dotenv.config({ path: "../.env"});
 
module.exports = {
    dislike : (req, res) => {

        const {dislike_idpost, dislike_iduser} = req.body

        const dislikeDate = new Date()

        const newdisLike = {dislike_idpost, dislike_iduser, dislikeDate}

        db.query('SELECT * FROM dislike WHERE dislike_idpost = ? AND dislike_iduser = ?', [dislike_idpost, dislike_iduser], (error, result) => {
                if (error) {
                    console.log(error)
                    res.status(401).json({ error : "Operation failed"})
                } 
                
                if (result.length) {
                    return res.status(400).json({ error : "You already dislike this post"})
                }
            
            db.query('INSERT INTO dislike SET ?', newdisLike, (error, result) => {
                if (error) {
                    console.log(error)
                    res.status(401).json({ error : "Operation failed"})
                } else {
                    res.status(200).json({ message : "disLike add"})
                }
            })
        })
    }, getDislikes : (req, res) => {
        db.query("SELECT * FROM dislikes", (error, results) => {
          if (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to retrieve dislikes" });
          } else {
            res.status(200).json(results);
          }
        });
      },

      getDislikeId : (req, res) => {
        const dislikeId = req.params.id;
      
        db.query("SELECT * FROM dislike WHERE id = ?", dislikeId, (error, results) => {
          if (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to retrieve the dislike" });
          } else if (results.length === 0) {
            res.status(404).json({ error: "dislike not found" });
          } else {
            res.status(200).json(results[0]);
          }
        });
      },

      updateDislikeId : (req, res) => {
        const dislikeId = req.params.id;
        const { dislikeDate, dislike_idpost, dislike_iduser} = req.body;
        const updatedDislike = {dislikeDate, dislike_idpost, dislike_iduser };
      
        db.query(
          "UPDATE dislike SET ? WHERE id = ?",
          [updatedislike, dislikeId],
          (error, result) => {
            if (error) {
              console.log(error);
              res.status(500).json({ error: "Failed to update the dislike" });
            } else if (result.affectedRows === 0) {
              res.status(404).json({ error: "Dislike not found" });
            } else {
              res.status(200).json({ message: "dislike  updated successfully" });
            }
          }
        );
      },

      deleteUser : (req, res) => {
        const dislikeId = req.params.id;
      
        db.query("DELETE FROM dislikes WHERE id = ?", dislikeId, (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to delete the dislike" });
          } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "Dislike not found" });
          } else {
            res.status(200).json({ message: "Dislike deleted successfully" });
          }
        });
      },
}