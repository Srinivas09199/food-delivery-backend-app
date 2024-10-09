const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const dotenv = require('dotenv')
const { connectDb } = require("./config/db")
const http = require('http');
const { Server } = require('socket.io');


//dot env config
dotenv.config()

//database connection
connectDb()

//rest object
const app = express()
const server = http.createServer(app);
const io = new Server(server);

//middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

//route
//URL => http://localhost:5050
app.use('/api/test', require("./routes/testRoute"))
app.use('/api/auth', require("./routes/authRoute"))
app.use('/api/user', require("./routes/userRoute"))
app.use('/api/restaurants', require('./routes/restaurantRoute'))
app.use('/api/orders', require('./routes/orderRoute'));

// WebSocket for real-time updates
io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('orderStatusUpdate', (orderId, status) => {
        io.emit(`order_${orderId}_status`, status);
    });
});

app.get('/', (req, res) => {
    return res.status(200).send("Welcome to Food Server")
}) 

//PORT
const PORT = process.env.PORT

//listen
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`)
})

