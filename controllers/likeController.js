const db = require('../config/dbConnection')

exports.like = (req, res) => {
    const { like_idpost, like_iduser } = req.body
    const likeDate = new Date()

    const like = { likeDate, like_iduser, like_idpost }

    db.query('SELECT * FROM likes WHERE like_idpost = ? AND like_iduser = ?', [like_idpost, like_iduser], (error, result) => {
        if (error) {
            console.log(error)
            return res.status(401).json({ error: 'Error'})
        } 

        if (result.length) {
            return res.status(401).json({ error: 'You already like this post.'})
        }  

        db.query('SELECT * FROM dislikes WHERE dislike_idpost = ? AND dislike_iduser = ?', [like_idpost, like_iduser], (error, result) => {
            if (error) {
                console.log(error)
                return res.status(401).json({ error: 'Error'})
            } 

            if (result[0]) {
                db.query('DELETE FROM dislikes WHERE dislike_idpost = ? AND dislike_iduser = ?', [like_idpost, like_iduser], (error, result) => {
                    
                    if(error) {
                        console.log(error)
                        res.status(400).json({
                            error: 'Failure'
                        })
                    }
                })   
            }

          })
        
            db.query('INSERT INTO likes SET ?', like, (error, result) => {

            if (error) {
                console.log(error)
                res.status(401).json({ error: 'Error'})
            }
            res.redirect('/')
        })
    })

    
}

exports.likes = (req, res) => {
    db.query('SELECT * FROM likes', (error, result) => {
        
        if(error) {
            console.log(error)
        } else {
            console.log('result', result)
            res.json(result)
        }
    })
}

exports.likeDelete = (req, res) => {
    const {like_idpost, like_iduser} = req.body

    db.query('SELECT * FROM likes WHERE like_idPost = ? AND like_idUser = ?', [like_idpost, like_iduser], (error, result) => {
        if (error) {
            console.log(error)
            return res.status(401).json({ error: 'Error'})
        } 

        if (!result.length) {
            return res.status(401).json({ error: 'You didn\'t like this post.'})
        } 

        db.query('DELETE FROM likes WHERE like_idPost = ? AND like_idUser = ?', [like_idpost, like_iduser], (error, result) => {
            
            if(error) {
                console.log(error)
                res.status(400).json({
                    error: 'Failure'
                })
            } else {
                res.redirect('/')
            }
        })
    })
}


