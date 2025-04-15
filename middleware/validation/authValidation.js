import User from "../../models/user.js"
export async function signupValidation(req, res, next) {
    
    const unUsers = await User.find({username : req.body.username})
    if (unUsers.length>0) {
        const error = new Error("this username already exists")
        error.status = 422
        throw error
    }
    const emailUsers = await User.find({email : req.body.email})
    if (emailUsers.length>0) {
        const error = new Error("this email already exists")
        error.status = 422
        throw error
    }
    next()
}
export async function loginValidation