import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: { //["success", "pending refund", "refunded"]
        type: String,
        default: "success"
    },
    products: {
        type: [{
            product: {
                _id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                price: { type: Number, required: true },
            },
            quantity : {
                type : Number,
                required : true,
                min : 1
            }
        }],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    transaction: {
        type: Schema.Types.ObjectId,
        ref: "Transaction"
    },
    deliveredAt: {
        type: Date,
    },

});

const Order = model('Order', orderSchema);

export default Order;
