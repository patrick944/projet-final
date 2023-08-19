const replyBtn = document.querySelectorAll('.commentBtn')

// async function comments() {
//     const comments = fetch(`/comments`)
//             .then(res => res.json())
//             .then(data => data)
//             // res.send(comments)
//             console.log(comments);
// }

// comments()

replyBtn.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        console.log('it worked')
        
        let parent = e.target.closest('.container')
        let id = parent.id
        if (id) {
            let children = parent.querySelectorAll(`[dataset=${id}]`)
            children.forEach((child) => child.classList.toggle('opened'))
        }
    })
})




