import User from "../models/user.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export default async function login({identifier, password, user}) {
    if (!user) {
        user = await User.findOne({
            $or: [{ username: identifier }, { email: identifier }]
        });
    }
    if (user) {
        console.log("found user")
        if (await bcrypt.compare(password, user.password)) {
            console.log("login successful");
            const token = jwt.sign({
                userID : user._id.toString(),
                createdAt : Date.now()
            }, process.env.JWT_TOKEN, { expiresIn : "24h"})
            return {token , userID : user._id, firstName : user.firstName, lastName : user.lastName, email : user.email, username : user.username}
        }
        else {
            console.log("bcrypt comparison failed");
            
        }
        return 401
    } else {
        return 401
    }
}