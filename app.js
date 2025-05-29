const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

let socketsConnected = new Set()

const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', onConnected)

function onConnected(socket) {
    console.log('A user connected:', socket.id)
    socketsConnected.add(socket.id)

    io.emit('connectedUsers', socketsConnected.size)

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id)
        socketsConnected.delete(socket.id)
        io.emit('connectedUsers', socketsConnected.size)
    })

    socket.on('sendMessage', (message) => {
        console.log('Message received:', message)
        socket.broadcast.emit('message', message)
    })
    
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data)
    })
}

