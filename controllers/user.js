import User from "../models/user.js"
import bcrypt from "bcryptjs"
import asyncHandler from 'express-async-handler';
import loginService from "../services/login.js"
const signup = asyncHandler(async function signup(req, res, next) {
    const unUsers = await User.find({ username: req.body.username })
    if (unUsers.length > 0) {
        const error = new Error("username already exists")
        res.status(422)
        next(error)
    }
    const emailUsers = await User.find({ email: req.body.email })
    if (emailUsers.length > 0) {
        const error = new Error("email already exists")
        res.status(422)
        next(error)
    }
    const hashedPW = await bcrypt.hash(req.body.password, 12)

    const user = new User({
        firstName: req.body.firstName, lastName: req.body.lastName, username: req.body.username, email: req.body.email, password: hashedPW
    })
    const result = await user.save()
    const loginResult = await loginService({ username: req.body.username, email: req.body.email, password: req.body.password , user : result})
    res.status(201).json({ message: "user created", userID: result._id, userInfo: loginResult})
})

const login = asyncHandler(async function login(req, res, next) {
    const result = await loginService({ identifier: req.body.identifier, password: req.body.password })
    if (result === 401) {
        let error = new Error(`wrong email or password`)
        res.status(401)
        next(error)
    }
    else {
        res.status(200).json(
            result
        )
    }
})
const getUser = asyncHandler(async function (req, res, next) {        
    res.status(200).json({
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        username: req.user.username,
        userID : req.user._id
    })
})
const changePassword = asyncHandler(async function changePassword(req, res, next) {
    const user = req.user
    console.log(req.body);
    const hashedPW = await bcrypt.hash(req.body.password, 12)
    user.password = hashedPW
    user.lastPasswordChangeDate = Date.now()
    const result = await user.save()
    res.status(200).json({ message: "password changed" })
})
const deleteUser = asyncHandler(async function deleteUser(req, res, next) {
    await req.user.deleteOne()
    res.status(200).json({ message: "user deleted" })
})
const getNotifications = asyncHandler(async function (req, res, next) {
    res.status(200).json(req.user.notifications)
})
const clearNotifications = asyncHandler(async function (req, res, next) {
    req.user.notifications = []
    await req.user.save()
    res.status(200).json({ message: "notifications deleted successfully" })
})
const markAsRead = asyncHandler(async function (req, res, next) {
    if (req.body.includes("all")) {
        req.user.notifications.map(notification => {
            return { ...notification, read: true }
        })
    } else {
        for (let notification of req.user.notifications) {
            if (req.body.includes(notification.id)) {
                notification.read = true
            }
        }
        await req.user.save()
        res.status(200).json({ message: "notifications marked as read" })
    }
})
export { signup, login, changePassword, deleteUser, getNotifications, clearNotifications, markAsRead, getUser }