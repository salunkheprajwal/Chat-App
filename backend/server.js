const express = require("express");
const dotenv = require("dotenv")
const { chats } = require("./data/data");
const connectDb = require('./config/db');
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const { notFound, errorHandler} = require("./middleware/errorMiddleware")

dotenv.config();
const app = express()

app.use(express.json());

connectDb();

app.get('/', (req, res) => {
    res.send("Api is running successfully");
});


// app.get('/api/chat', (req, res) => {
//     res.send(chats)
// });

// app.get("/api/chat/:id", (req, res) => {
//     //console.log(req.params.id);
    
//     const singlechat = chats.find(c => c?._id === req.params.id);
//     res.send(singlechat)
// });

app.use("/api/user", userRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRoutes);


app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
    

const server = app.listen(5000, console.log(`server started on port ${PORT}`));

const io = require('socket.io')(server, {
    pingTimeout:60000,
    cors: {
        origin:"http://localhost:3000"
    }
})

io.on("connection", (socket) => {
    console.log("connected to socket.io")
    socket.on('setUp', (userData) => {
        socket.join(userData?._id);
        console.log(userData?._id);
        socket.emit('connected');
    });
    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("user joined Room:" + room)
    });
    socket.on('typing', (room) => socket.in(room).emit("typing"));
        socket.on('stop typing', (room) => socket.in(room).emit("stop typing"));


    socket.on('new message', (newMessgeRecive) => {
        var chat = newMessgeRecive.chat;
        if (!chat?.users) return console.log("chat?.users not defined");
        chat?.users.foEach(user => {
            if (user?._id == newMessgeRecived.sender?._id) return;
            socket.in(user?._id).emit("message recived", newMessgeRecived)
        });
    });
    socket.off("setup", () => {
        console.log("USER DICONNECTED");
        socket.leave(userData?._id);
    });
});
