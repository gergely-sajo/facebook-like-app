const Post = require('../models/Post')

exports.viewCreateScreen = function(req, res) {
    res.render('create-post')
}

exports.create = function(req, res) {
    let post = new Post(req.body, req.session.user._id)
    post.create().then(() => {
        res.send("New post created.")
    }).catch((errors) => {
        res.send(errors)
    })
}

exports.viewSingle = async function(req, res) {
    try {
        let post = await Post.findSingleById(req.params.id, req.visitorId)
        res.render('single-post-screen', {post: post})
    } catch {
        res.render('404')
    }
}

exports.viewEditScreen = async function(req, res) {
    try {
        let post = await Post.findSingleById(req.params.id)
        res.render('edit-post', {post: post})
    } catch {
        res.render('404')
    }
}

exports.edit = function(req, res) {
    let post = new Post(req.body, req.visitorId, req.params.id)
    post.update().then((status) => {
        if (status = "success") {
            // post was updated in the database
            req.flash("success", "Post successfully updated.")
            req.session.save(() => {
                res.redirect(`/post/${req.params.id}/edit`)
            })
        } else {
            // there were validation errors
            post.errors.forEach((error) => {
                req.flash("errors", error)
            })
            req.session.save(() => {
                res.redirect(`/post/${req.params.id}/edit`)
            })
        }

    }).catch(() => {
        // a post with the requested id doesnt exist
        // or the current visitor is not the owner of the requested post
        req.flash("errors", "You do not have permission to edit this post!")
        req.session.save(() => {
            res.redirect('/')
        })
    })
}
