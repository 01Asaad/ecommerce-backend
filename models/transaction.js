import { Schema, model } from 'mongoose';

const transactionSchema = new Schema({
    creator : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    type : { //[income, outcome]
        type : String,
        required : true
    },
    method : { //[paypal, creditCart, balance]
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now,
    },
});

const Transaction = model('Transaction', transactionSchema);

export default Transaction;