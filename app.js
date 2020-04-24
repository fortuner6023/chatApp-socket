const express = require('express')
const app = express()
const http = require('http').Server(app)
const port = 3000
const io = require('socket.io')(http)
const path = require('path')
const { generateMessage } = require('./src/utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./src/utils/users')

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

//? Home Page  
app.get('/', (req, res) => {
    res.sendfile('index.html')
})

//?when user connect this code executed
io.on('connection', (socket) => {
    console.log('A user connected');


    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })
        if (error) {
            return callback(error)
        }

        socket.join(user.room)
        //?io.to.emit(), socket.broadcast.to.emit()
        socket.emit('message', generateMessage('Admin', 'Welcome User '))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has Joined`))

        //? show user online user list
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)    
        //? we use io.emit() instead of socket.emit() because we show our msg to all clients not only myself 
        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })












    //?when user disconnected this code is executed
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left !`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

//? server listening 
http.listen(port || 3000, () => {
    console.log('server is listening on port : ', port);
})