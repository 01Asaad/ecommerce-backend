import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Cart = model('Cart', cartSchema);

export default Cart;