//modules
const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');

//init server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//bd connection
mongoose.connect('mongodb://localhost/chat-database')
    .then(db => console.log('db is connected'))
    .catch(err => console.log(err));

//assign avaible port or the one defined by us
app.set('port', process.env.PORT || 3000);
require('./sockets')(io);

//static files
app.use(express.static(path.join(__dirname, "public")));

//starting the server
server.listen(3000, () => {
    console.log('server on port', app.get('port'));
});