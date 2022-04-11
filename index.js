const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const registerRoute = require('./Routes/RegisterRoute');
const logInRoute = require('./Routes/LoginRoute');
const https = require('https');

//static middleware for external css instead of Route
app.use(bodyParser.json());
app.use('/register', registerRoute);
app.use('/logIn', logInRoute);
//To Connect to DB
mongoose.connect('mongodb://127.0.0.1:27017/CC_Aufgabe1');

//Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Frontend/login_register.html');
});

app.get('/register', (req,res) => {
  res.sendFile(__dirname + '/Frontend/register.html');
});

app.get('/index', (req,res) => {
  res.sendFile(__dirname + '/Frontend/index.html');
});

app.get('/logIn', (req,res) => {
  res.sendFile(__dirname + '/Frontend/logIn.html');
});

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/Frontend/register.html');
});

app.get('/chatroom', (req, res) => {
  res.sendFile(__dirname + '/Frontend/index.html')
})

io.on('connection', (socket) => {
  console.log('a user connected');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
    });
});

io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets

io.on('connection', (socket) => {
    socket.broadcast.emit('hi');
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
});

//https Server
const sslServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem')),
  },
  app
)

sslServer.listen(3000, () => console.log('SSL Server on Port 3000'));