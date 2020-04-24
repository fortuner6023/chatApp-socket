var httpServer = http.createServer(app).listen(port, function () {
    console.log('Node app is listening on port.. ' + port);
});
io = require('socket.io')(httpServer);

io.on("connection", function (socket) {
    console.log('a user connected');
    socket.on('join', (data) => {
        console.log(' Socket data ', data); w
        socket.join(data.room);
        //socket.join(data.room2);
        console.log(io.sockets.adapter.rooms);
    });
    socket.on("socketFromClient", function (msg) {

        if (msg.methodName && msg.methodName == "chat") {
            console.log('we are in chat')
            chat.save_message(msg, function (err, data) {
                console.log('err', err);
                console.log('data', data)
                if (err) {
                    return socket.emit('responseFromServer', err);
                }
                if (data) {
                    console.log('data', data.data.roomid)
                    io.in(data.data.roomid).emit('responseFromServer', data);
                }
            });
        }
        //--------------------------------------------chat working -----------------------------
    });
    socket.on('disconnect', function (socket) {
        console.log('a user disconnected');
    })
});