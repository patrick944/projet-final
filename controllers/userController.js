const bcrypt = require("bcrypt");
const db = require("../config/dbConnection");
const generateToken = require("../jwttools").generateToken

const dotenv = require("dotenv");
dotenv.config({ path: "../.env"});

module.exports = {
      addUser : (req, res) => {
        const { name, password, role, email, photoprofil } = req.body;
      db.query("SELECT * FROM users WHERE email = ?", email, (error, result) => {
        console.log(result);
        if (error) {
          console.log(error)
          // res.status(500).json({ error : "Operation failed"})
          const errMess = "Operation failed"
            res.render('register', {errMess})
        } else if (result[0]){
            // res.status(400).json({ error: "This email is already taken"})
            console.log('email pb');
            const errMess = "This email is already taken"
            res.render('register', {errMess})
          }
      })
        bcrypt.hash(password, 10, (error, hashedPassword) => {
          if (error) {

            console.log('Bcrypt', error);
            res.status(500).json({ error: "Operation failed" });
          } else {
            console.log('sql');
            const newUser = { name, password: hashedPassword, role, email };
            db.query("INSERT INTO users SET ?", newUser, (error, result) => {
              if (error) {
                console.log(error);
                res.status(500).json({ error: "Operation failed" });
              } else {
                const user = { id: result.insertId, ...newUser };
                const token = generateToken(user);
                res.status(201).json({
                  message: "User created successfully",
                  token: token,
                });
              }
            });
          }
        });
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

      getUserId : (req, res) => {
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

      updateUserId : (req, res) => {
        const userId = req.params.id;
        const { name, password, role, email } = req.body;
        const updatedUser = { name, password, role, email };
      
        db.query(
          "UPDATE users SET ? WHERE id = ?",
          [updatedUser, userId],
          (error, result) => {
            if (error) {
              console.log(error);
              res.status(500).json({ error: "Failed to update the user" });
            } else if (result.affectedRows === 0) {
              res.status(404).json({ error: "User not found" });
            } else {
              res.status(200).json({ message: "User updated successfully" });
            }
          }
        );
      },

      deleteUser : (req, res) => {
        const userId = req.params.id;
      
        db.query("DELETE FROM users WHERE id = ?", userId, (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to delete the user" });
          } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "User not found" });
          } else {
            res.status(200).json({ message: "User deleted successfully" });
          }
        });
      },

      loginUser : (req, res) => {
        const { email, password } = req.body;
      
        db.query("SELECT * FROM users WHERE email = ?", email, (error, results) => {
          if (!results) {
            // res.status(401).json({ error: "Invalid email or password" });
            const errMess = "Invalid email or password"
            res.render('login', {errMess})
          }  else if (error) {
            console.log(error);
            // res.status(500).json({ error: "Failed to login" });
            const errMess = "Failed to login"
            res.render('login', {errMess})
          } else {
            const user = results[0];
            bcrypt.compare(password, user.password, (error, isMatch) => {
              if (error) {
                console.log(error);
                // res.status(500).json({ error: "Failed to login" });
                const errMess = "Failed to login"
            res.render('login', {errMess})
              } else if (isMatch) {
                const token = generateToken(user);
                // res.status(200).json({
                //   message: "Login successful",
                //   token: token,
                // });
                res.cookie("jwt", token)
                res.redirect("/")
              } else {
                // res.status(401).json({ error: "Invalid email or password" });
                const errMess = "Invalid email or password"
                res.render('login', {errMess})
              }
            });
          }
        });
      },
      Userlogout :(req, res) => {
        res.cookie('jwtCookie', 'logout', {
            expires: new Date(Date.now() + 2 * 1000),
            httpOnly : true
        })
    
        res.status(200).redirect('/')
    },
    me : (req, res) => {
      const id = req.params.id
     db.query('SELECT * FROM user WHERE idUser = ?', id, (req, res) => {
      if (error) {
          console.log(error)
          res.status(401).json({ error: 'Error'})
      } else {
          res.status(200).json({ message: 'Success'})
      }
     })
    }, 
    
    isLoggedIn :async (req, res, next) => {
        if ( req.cookies.jwtCookie ) {
            try {
                const decoded = await promisify(jwt.verify)(req.cookies.jwtCookie, process.env.JWT_SECRET
                    )
                
                    console.log(decoded)
                const id = decoded.id
                
                db.query('SELECT * FROM user WHERE idUser = ?', id, (error, result) => {
                        try {
                            if (!result) {
                                res.status(401).json({ message : 'Your token match with no user.'})
                            } 
                            console.log(req.user);
                            req.user = result[0]
                            // console.log(req.user);
    
                        } catch (error) {
                            console.log(error)
                            res.status(401).json({ error : 'Error'})
                        }
                    })
                
            } catch (error) {
                console.log(error)
                res.status(401).json({ error : 'Error'})
            }
        }
        next()
    }
}