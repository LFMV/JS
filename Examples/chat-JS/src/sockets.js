const Chat = require('./models/Chat');

const { use } = require("express/lib/application");

//socket server
module.exports = function(io) {

    let users = {

    }

    io.on('connection', async socket => {
        console.log('new user connected');

        let messages = await Chat.find({}); //calls the message from the DB
        socket.emit('load old msgs', messages); //send frond-end ./public/js/main.js

        socket.on('new user', (data, cb) => { //cb = call back
            console.log(data);
            if (data in users) {
                cb(false);
            } else {
                cb(true);
                socket.nickname = data;
                //each user that connects will have the information of their socket
                users[socket.nickname] = socket;
                updateNicknames();
            }

        });

        //server receives the event 'send message' and the nick and puts it to an object
        socket.on('send message', async(data, callback) => {

            var msg = data.trim();
            "Example  '/w ' Luis texto  "
            if (msg.substr(0, 3) === '/w ') // Check if it´s private
            {
                msg = msg.substr(3); // check Name
                const index = msg.indexOf(' '); // Determine whitespaces after user

                if (index !== -1) {
                    var name = msg.substr(0, index); // name (from 0 to blank space)
                    var msg = msg.substr(index + 1) //message (form blank space onwards)
                    if (name in users) {
                        users[name].emit('whisper', {
                            msg, // msg: msg,
                            nick: socket.nickname //send de socket row 10            
                        });
                    } else {
                        callback('Error! Please enter valid user')
                    }
                } else {
                    callback('Error! Please enter your message')
                }
            } else {
                var newMsg = new Chat({
                    msg,
                    nick: socket.nickname
                });
                await newMsg.save(); //Save message of the DB

                io.sockets.emit('new message', {
                    msg: data,
                    nick: socket.nickname
                });
            }
        });

        //Listen when a socket is disconnect
        socket.on('disconnect', data => {
            if (!socket.nickname) return;
            delete users[socket.nickname];
            updateNicknames();
        });

        function updateNicknames() {
            io.sockets.emit('usernames', Object.keys(users)); // send user array
        };

    });
}