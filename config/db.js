const mongoose = require('mongoose')

//function mongoDB Database connection
exports.connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`Database connected ${mongoose.connection.host}`)
    } catch (error) {
        console.log(error)

    }
}
