const bcrypt = require("bcrypt");
const promisify = require("util").promisify
const db = require("../config/dbConnection");
const generateToken = require("../jwttools").generateToken
const jwt = require("jsonwebtoken")

const dotenv = require("dotenv");
dotenv.config({ path: "../.env"});

module.exports = {
      register : (req, res) => {
        const { name, password, email } = req.body;

        const photoprofil = req.filename

        db.query("SELECT * FROM users WHERE email = ?", email, (error, result) => {
          if (error) {
            console.log('ERROR LIER Q LQ BQSE DE DONNEE', error)
          }
          
          if (result.length > 0) {
            const errMess = "This email is already taken"
            return res.status(400).render('register', { errMess });
          }

          bcrypt.hash(password, 10, (error, hashedPassword) => {
            if (error) {
              res.status(500).json({ error: "Operation failed" });
            } else {
              const newUser = { name, password: hashedPassword, email, photoprofil };
              db.query("INSERT INTO users SET ?", newUser, (error, result) => {
                if (error) {
                  res.status(500).json({ error: "Operation failed" });
                } else {
                  const user = { id: result.insertId, ...newUser };
                  const token = generateToken(user);
                  res.cookie("jwt", token)
                  res.status(201)
                  res.redirect('/')
                }
              });
            }
          });
        })
      },

      getUsers : (req, res) => {
        db.query("SELECT * FROM users", (error, results) => {
          if (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to retrieve users" });
          } else {
            res.status(200).json(results);
          }
        });
      },

      getUserById : (req, res) => {
        const userId = req.params.id;
      
        db.query("SELECT * FROM users WHERE id = ?", userId, (error, results) => {
          if (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to retrieve the user" });
          } else if (results.length === 0) {
            res.status(404).json({ error: "User not found" });
          } else {
            res.status(200).json(results[0]);
          }
        });
      },

      updateUserById : (req, res) => {
        const userId = req.user.id;

        const { name, email } = req.body;
        const updatedUser = { name, email };

        db.query(
          "UPDATE users SET ? WHERE id = ?",
          [updatedUser, userId],
          (error, result) => {
            if (error) {
              console.log(error);
              const messg = "Failed to update the user"
              res.render("profile", { messg });
            } else if (result.affectedRows === 0) {
              const messg = "User not found"
              res.render("profile", { messg });
            } else {
              const messg = "User updated successfully"
              res.render("profile", { messg });
            }
          }
        );
      },

      deleteUser : (req, res) => {
        const userId = req.user.id;
      
        db.query("DELETE FROM users WHERE id = ?", userId, (error, result) => {
          if (error) {
            console.log(error);
            const messg = "Failed to delete the user"
              res.render("profile", { messg });
          } else {
            const messg = "Vous n'êtes plus sur notre SIte"
            res.cookie('jwtCookie', 'logout', {
              expires: new Date(Date.now() + 2 * 1000),
              httpOnly : true
          })
      
            res.status(200).redirect('/')
          }
        });
      },

      loginUser : (req, res) => {
        const { email, password } = req.body;
        
        db.query("SELECT * FROM users WHERE email = ?", email, (error, results) => {
          if (!results) {
            const errMess = "Utilisateur existe pas dans la bdd"
            return res.status(400).render('login', { errMess });
          }  else if (error) {
            console.log(error);
            const errMess = "Failed to login"
            return res.status(400).render('login', { errMess });
          } else {
            const user = results[0];
            const hash = password
            bcrypt.compare(password, user.password, (error, isMatch) => {
              if (error) {
                const errMess = "password dont match"
                return res.status(400).render('login', { errMess });
              } else if (isMatch) {
                const token = generateToken(user);
                res.cookie("jwt", token)
                res.redirect("/profile")
              } else {
                const errMess = "Invalid email or password"
                return res.status(400).render('login', { errMess });
              }
            });
          }
        });
      },
      Userlogout :(req, res) => {
        res.clearCookie("jwt")
        res.status(200).redirect('/login')
    },
    me : (req, res) => {
      const id = req.params.id
     db.query('SELECT * FROM users WHERE id = ?', id, (req, res) => {
      if (error) {
          console.log(error)
          res.status(401).json({ error: 'Error'})
      } else {
          res.status(200).json({ message: 'Success'})
      }
     })
    }, 
    
    isLoggedIn :async (req, res, next) => {
        if ( req.cookies.jwt ) {
            try {
                const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
                // const decoded = jwt.verify(req.cookies.jwt,process.env.JWT_SECRET)
                    // console.log("TOKEN DECODED",decoded)
                const id = decoded.id
                console.log(id)
                db.query('SELECT * FROM users WHERE id = ?', id, (error, result) => {
                        try {
                          // console.log("GET USER FROM DB",result)
                            if (!result) {
                               return res.status(401).json({ message : 'Your token match with no user.'})
                            } 
                            // console.log("USER FROM ISLOGGEDIN FUNCTION",result[0]);
                            req.user = result[0]
                            
                            next()
    
                        } catch (error) {
                            // console.log("USER NO FOUND FROM DATABASE",error)
                            return res.status(401).json({ error : 'Error'})
                        }
                    })
                
            } catch (error) {
                // console.log("USER ISLOGGEDIN ERROR",error)
                return res.status(401).json({ error : 'Error'})
            }
        } else {
          res.redirect('/login')
        }
        
    }
}