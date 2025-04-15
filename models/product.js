import { Schema, model } from 'mongoose';

const productSchema = new Schema({
    name : {
        type : String,
        required : true,
    },
    provider : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    stock : {
        type : Number,
        required : true
    },
    enabled : {
        type : Boolean,
        default : true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    modifiedAt : {
        type: Date,
        default: Date.now
    },
    image : {
        type : String,
    }
    
});

const Product = model('Product', productSchema);

export default Product;
