const bcrypt = require("bcrypt");
const db = require("../config/dbConnection");
const generateToken = require("../jwttools").generateToken

const dotenv = require("dotenv");
dotenv.config({ path: "../.env"});

    module.exports = {
        post : (req, res) => {
    
          const {titre, description} = req.body
          const postDate = new Date()
          let postimage = req.filename
          
          if(!postimage) {
            postimage = ''
          }

          const post = {titre, postimage, description, postDate}

  
          db.query('INSERT INTO posts SET ?', post, (error, result) => {
              if (error) {
                  console.log(error)
                  res.status(401).json({ error : "Operation failed"})
              } else {
                const message = "post add"
                  res.status(200).json({ message : "Post add"}) 
                  // return res.status(200).render('/', { message });
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

            const postId = req.params.id
            console.log(postId);
          
            db.query("SELECT * FROM posts WHERE idpost = ?", postId, (error, result) => {
              if (error) {
                console.log(error);
                res.status(500).json({ error: "Failed to retrieve the post" });
              } else if (result.length === 0) {
                res.status(404).json({ error: "Post not found" });
              } else {
                res.status(200).json(result[0]);
                console.log(result[0])
            
              }
            });
          },
    
          updatePostId : async (req, res) => {
            const postId = req.query.id
            const postOne = await fetch(`http://localhost:5000/post/${postId}`).then(data => data.json())

            const formData = new FormData()
            formData.append

            const { titre, description } = req.body
            const postDate = new Date();  
            
            let postimage = '';    
            if (postOne.postimage) {
              postimage = postOne.postimage;
            } else {
              postimage = 'default.jpg';
            }
            
            const post = {
              titre, 
              postimage, 
              description, 
              postDate
            }

            db.query("UPDATE posts SET ? WHERE idpost = ?", [ post , postId], (error, result) => {
                if (error) {
                  const errorMsg = "Failed to update the post"
                  return res.status(500).render('updatePost', { errorMsg });
                } else if (result.affectedRows === 0) {
                  const errorMsg = "Post not found"
                  return res.status(404).render('updatePost', { errorMsg });
                } else {
                  console.log(result)
                  const message = "Post updated successfully"
                  return res.status(200).render('updatePost', { message });
                }
              }
            );
          },
    
          deletePost : (req, res) => {
            const postId = req.query.idpost;
            console.log('---------', postId);
            db.query("DELETE FROM posts WHERE idpost = ?", postId, (error, result) => {
              if (error) {
                console.log(error);
                const errorMsg = "Failed to delete the post"
                return res.status(500).render('updatePost', { errorMsg });
              } else if (result.affectedRows === 0) {
                res.status(404).json({ error: "Post not found" });
                const errorMsg = "Post not found"
                return res.status(404).render('updatePost', { errorMsg });
              } else {
                return res.redirect('/');
              }
            });
          },
    }
   








    // const bcrypt = require("bcrypt");
// const db = require("../config/dbConnection");
// const generateToken = require("../jwttools").generateToken
// const userCTRL = require('../controllers/userController')


// async function home() {
    

// }
// const dotenv = require("dotenv");
// dotenv.config({ path: "../.env"});

//     module.exports = {
//         post : async (req, res) => {
//             const {postTexte, posts_users} = req.body

//             console.log('----------IMAGE-------------', req.body);
//             console.log('----------IMAGE-------------', req.filename);

//             if (!posts_users) {
//               const errMess = "Vous devez être connecté."
//               const succMess = ""
              
//               const me = ''

//               const users = await fetch(`http://localhost:5000/users`).then(data => data.json()).then(data => data.reverse())

//               const comments = await fetch(`http://localhost:5000/comments`).then(data => data.json()).then(data => data.reverse())

//               const posts = await fetch(`http://localhost:5000/posts`).then(data => data.json()).then(data => data.reverse())

//               const likes = await fetch(`http://localhost:5000/likes`).then(data => data.json()).then(data => data)

//               const dislike = await fetch(`http://localhost:5000/dislike`).then(data => data.json()).then(data => data)

//               return res.render('home', {users, posts, me, comments, likes, dislike, errMess, succMess})
//             } 
            
//             let postImage = ''
//             let postVideo = ''

//             postImage = req.filename

//             const postDate = new Date()
//             console.log('----------IMAGE-------------', postImage);
//             const post= { postTexte, postImage, postVideo, postDate, posts_users }

//             if (postTexte == '' && postImage == '' && postVideo == '') {
//                     const errMess = "Veuillez remplir le post"
//                     const succMess = ""
//                     const users = await fetch(`http://localhost:5000/users`).then(data => data.json()).then(data => data.reverse())

//                     const comments = await fetch(`http://localhost:5000/comments`).then(data => data.json()).then(data => data.reverse())

//                     const posts = await fetch(`http://localhost:5000/posts`).then(data => data.json()).then(data => data.reverse())

//                     const likes = await fetch(`http://localhost:5000/likes`).then(data => data.json()).then(data => data)
    
//                     const dislike = await fetch(`http://localhost:5000/dislike`).then(data => data.json()).then(data => data)

//                     return res.render('home', {users, posts, me, comments, likes, dislike, errMess, succMess})
//                   }

//                 db.query('INSERT INTO posts SET ?', post, async (error, result) => {
                    
                  
//                     if (error) {
//                       console.log(error)
//                       const errMess = "Operation failed"
//                       const succMess = ""
//                       const users = await fetch(`http://localhost:5000/users`).then(data => data.json()).then(data => data.reverse())

//                       const comments = await fetch(`http://localhost:5000/comments`).then(data => data.json()).then(data => data.reverse())

//                       const posts = await fetch(`http://localhost:5000/posts`).then(data => data.json()).then(data => data.reverse())

//                       const likes = await fetch(`http://localhost:5000/likes`).then(data => data.json()).then(data => data)
      
//                       const dislike = await fetch(`http://localhost:5000/dislike`).then(data => data.json()).then(data => data)

//                       return res.render('home', {users, posts, me, comments, likes, dislike, errMess, succMess})
//                     } else {
//                       const succMess = "Post add"

//                       const errMess = ""

//                       const comments = await fetch(`http://localhost:5000/comments`).then(data => data.json()).then(data => data.reverse())

//                       const posts = await fetch(`http://localhost:5000/posts`).then(data => data.json()).then(data => data.reverse())

//                       const likes = await fetch(`http://localhost:5000/likes`).then(data => data.json()).then(data => data)
      
//                       const dislike = await fetch(`http://localhost:5000/dislike`).then(data => data.json()).then(data => data)

//                       return res.redirect('/')
//                     }
//                 })
//         }, 
        
//         getPosts : (req, res) => {
//             db.query("SELECT * FROM posts", (error, results) => {
//               if (error) {
//                 console.log(error);
//                 res.status(500).json({ error: "Failed to retrieve posts" });
//               } else {
//                 res.status(200).json(results);
//               }
//             });
//           },
    
//           getPostId : (req, res) => {
//             const postId = req.params.id;
          
//             db.query("SELECT * FROM posts WHERE id = ?", postId, (error, results) => {
//               if (error) {
//                 console.log(error);
//                 res.status(500).json({ error: "Failed to retrieve the post" });
//               } else if (results.length === 0) {
//                 res.status(404).json({ error: "Post not found" });
//               } else {
//                 res.status(200).json(results[0]);
//               }
//             });
//           },
    
//           updatePostId : (req, res) => {
//             const postId = req.params.id;
//             const { message, image, vidéo, postDate } = req.body;
//             const updatedPost = { message, image, vidéo, postDate  };
          
//             db.query(
//               "UPDATE posts SET ? WHERE id = ?",
//               [updatedPost, postId],
//               (error, result) => {
//                 if (error) {
//                   console.log(error);
//                   res.status(500).json({ error: "Failed to update the post" });
//                 } else if (result.affectedRows === 0) {
//                   res.status(404).json({ error: "Post not found" });
//                 } else {
//                   res.status(200).json({ message: "Post updated successfully" });
//                 }
//               }
//             );
//           },
    
//           deletePost : (req, res) => {
//             const postId = req.params.id;
          
//             db.query("DELETE FROM posts WHERE id = ?", postId, (error, result) => {
//               if (error) {
//                 console.log(error);
//                 res.status(500).json({ error: "Failed to delete the post" });
//               } else if (result.affectedRows === 0) {
//                 res.status(404).json({ error: "Post not found" });
//               } else {
//                 res.status(200).json({ message: "Post deleted successfully" });
//               }
//             });
//           },
//     }
