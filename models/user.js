import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        unique: false
    },
    lastName: {
        type: String,
        required: true,
        unique: false
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin : {
        type : Boolean,
        default : false
    },
    balance : {
        type : Number,
        default : 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    merchant : {
        type : Boolean,
        default : false
    },
    image : {
        type : String
    },
    notifications : [
        {
            title : {
                type : String
            },
            text : {
                type : String
            },
            read : {
                type : Boolean
            }
        }
    ]
    
});

const User = model('User', userSchema);

export default User;
