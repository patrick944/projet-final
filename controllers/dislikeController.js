const bcrypt = require("bcrypt");
const db = require("../config/dbConnection");
const generateToken = require("../jwttools").generateToken

const dotenv = require("dotenv");
dotenv.config({ path: "../.env"});
 
module.exports = {

  dislike : (req, res) => {
    const { dislike_idpost, dislike_iduser } = req.body
    const dislikeDate = new Date()
    let me
    const dislike = { dislikeDate, dislike_iduser, dislike_idpost }

    db.query('SELECT * FROM dislikes WHERE dislike_idpost = ? AND dislike_iduser = ?', [dislike_idpost, dislike_iduser], async (error, result) => {
        if (error) {
            console.log(error)
            return res.status(401).json({ error: 'Error'})
        } 

        if (result.length) {
          const errMess = 'You already dislike this post.'

          db.query('SELECT * FROM users WHERE id = ?', dislike_iduser, (error, result) => {
            if (error) {
              console.log(error)
              return res.status(401).json({ error: 'Error'})
          } 
          
          me = result
          
          })

          const posts = await fetch(`http://localhost:5000/posts`).then(data => data.json()).then(data => data.reverse())

          const comment = ''

          const likes = await fetch(`http://localhost:5000/likes`).then(data => data.json()).then(data => data.reverse())

          const dislikes = await fetch(`http://localhost:5000/dislikes`).then(data => data.json()).then(data => data)

          const follows = ''

          return res.render('home', {errMess, me, posts, likes, dislikes})
          // return res.status(401).json({ error: 'You already dislike this post.'})
        }

        db.query('SELECT * FROM likes WHERE like_idPost = ? AND like_idUser = ?', [dislike_idpost, dislike_iduser], (error, result) => {
          if (error) {
              console.log(error)
              return res.status(401).json({ error: 'Error'})
          } 
  
          if (result[0]) {
            db.query('DELETE FROM likes WHERE like_idpost = ? AND like_iduser = ?', [dislike_idpost, dislike_iduser], (error, result) => {
                if(error) {
                    console.log(error)
                    res.status(400).json({
                        error: 'Failure'
                    })
                }
            })   
          }
          
          db.query('DELETE FROM likes WHERE like_idPost = ? AND like_idUser = ?', [dislike_idpost, dislike_iduser], (error, result) => {
              
              if(error) {
                  console.log(error)
                  res.status(400).json({
                      error: 'Failure'
                  })
              }
          })

        })

        db.query('INSERT INTO dislikes SET ?', dislike, (error, result) => {

            if (error) {
                console.log(error)
                res.status(401).json({ error: 'Error'})
            }
            
            res.redirect('/')
        })
    })

    
  },
     getDislikes : (req, res) => {
        db.query("SELECT * FROM dislikes", (error, results) => {
          if (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to retrieve dislikes" });
          } else {
            if (!results) {
              res.status(200).json([{}]);
            }
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