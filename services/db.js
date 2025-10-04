import mongoose from 'mongoose';
var db
async function connect() {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DBUSERNAME}:${process.env.DBPASSWORD}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=${process.env.DB_APP_NAME}`)
        db = mongoose.connection
        console.log('MongoDB connected successfully')
    }
    catch(err) {
        console.error('MongoDB connection error:', err.stack)
        return false
    }
    return true
}
export {connect, db}


