const usersCollecion = require('../db').db().collection("users")
const followsCollecion = require('../db').db().collection("follows")
const ObjectID = require('mongodb').ObjectID
const User = require('./User')

let Follow = function(followedUsername, authorId) {
    this.followedUsername = followedUsername
    this.authorId = authorId
    this.errors = []
}

Follow.prototype.cleanUp = function() {
    if (typeof(this.followedUsername) != "string") {
        this.followedUsername = ""
    }
}

Follow.prototype.validate = async function(action) {
    // followedUsername must exist in database
    let followedAccount = await usersCollecion.findOne({username: this.followedUsername})
    if (followedAccount) {
        this.followedId = followedAccount._id
    } else {
        this.errors.push("You cannot follow a user that does not exist.")
    }

    let doesFollowAlreadyExist = await followsCollecion.findOne({followedId: this.followedId, authorId: new ObjectID(this.authorId)})
    
    if (action == "create") {
        if (doesFollowAlreadyExist) {
            this.errors.push("You are already following this user.")
        }
    }

    if (action == "delete") {
        if (!doesFollowAlreadyExist) {
            this.errors.push("You cannot stop following someone you do not already follow.")
        }
    }

    // Should Not Be Able To Follow Yourself
    if (this.followedId.equals(this.authorId)) {
        this.errors.push("You cannot follow yourself.")
    }
}

Follow.prototype.create = function() {
    return new Promise(async (resolve, reject) => {
        this.cleanUp()
        await this.validate("create")
        if (!this.errors.length) {
            await followsCollecion.insertOne({followedId: this.followedId, authorId: new ObjectID(this.authorId)})
            resolve()
        } else {
            reject(this.errors)
        }
    })
}

Follow.prototype.delete = function() {
    return new Promise(async (resolve, reject) => {
        this.cleanUp()
        await this.validate("delete")
        if (!this.errors.length) {
            await followsCollecion.deleteOne({followedId: this.followedId, authorId: new ObjectID(this.authorId)})
            resolve()
        } else {
            reject(this.errors)
        }
    })
}

Follow.isVisitorFollowing = async function(followedId, visitorId) {
    let followDoc = await followsCollecion.findOne({followedId: followedId, authorId: new ObjectID(visitorId)})
    if (followDoc) {
        return true
    } else {
        return false
    }
}

Follow.getFollowersById = function(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let followers = await followsCollecion.aggregate([
                {$match: {followedId: id}},
                {$lookup: {from: "users", localField: "authorId", foreignField: "_id", as: "userDoc"}},
                {$project: {
                    username: {$arrayElemAt: ["$userDoc.username", 0]},
                    email: {$arrayElemAt: ["$userDoc.email", 0]}
                }}
            ]).toArray()

            followers = followers.map(function(follower) {
                let user = new User(follower, true)
                return {username: follower.username, avatar: user.avatar}
            })

            resolve(followers)
        } catch {
            reject()
        }
    })
}

Follow.getFollowingById = function(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let following = await followsCollecion.aggregate([
                {$match: {authorId: id}},
                {$lookup: {from: "users", localField: "followedId", foreignField: "_id", as: "userDoc"}},
                {$project: {
                    username: {$arrayElemAt: ["$userDoc.username", 0]},
                    email: {$arrayElemAt: ["$userDoc.email", 0]}
                }}
            ]).toArray()

            following = following.map(function(following) {
                let user = new User(following, true)
                return {username: following.username, avatar: user.avatar}
            })

            resolve(following)
        } catch {
            reject()
        }
    })
}

module.exports = Follow