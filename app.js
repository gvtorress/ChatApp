const express = require('express')
const socket = require('socket.io')
const cors = require('cors')

const app = express()

const User = require('./models/user')
const Message = require('./models/message')
const Room = require('./models/room')

app.use(express.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
    res.header(
        'Access-Control-Allow-Headers',
        'X-PINGOTHER, Content-Type, Authorization'
    )
    app.use(cors())
    next()
})

app.get('/', function (req, res) {
    res.send('Welcome!')
})

app.get('/listMessages/:room', async (req, res) => {
    const { room } = req.params
    await Message.findAll({
        order: [['id', 'ASC']],
        where: { roomId: room },
        include: [
            {
                model: User
            },
            {
                model: Room
            }
        ]
    })
        .then(messages => {
            return res.json({
                error: false,
                messages
            })
        })
        .catch(() => {
            return res.status(400).json({
                error: true,
                message: 'Error: No messages found'
            })
        })
})

app.get('/listMessagesMobile/:room', async (req, res) => {
    const { room } = req.params
    await Message.findAll({
        order: [['id', 'DESC']],
        where: { roomId: room },
        include: [
            {
                model: User
            },
            {
                model: Room
            }
        ]
    })
        .then(messages => {
            return res.json({
                error: false,
                messages
            })
        })
        .catch(() => {
            return res.status(400).json({
                error: true,
                message: 'Error: No messages found'
            })
        })
})

app.post('/registerMessage', async (req, res) => {
    await Message.create(req.body)
        .then(() => {
            res.json({
                error: false,
                message: 'Message registered successfully'
            })
        })
        .catch(() => {
            return res.status(400).json({
                error: true,
                message: "Error: Couldn't complete message registration"
            })
        })
})

app.get('/listRooms', async (req, res) => {
    await Room.findAll({
        order: [['name', 'ASC']]
    })
        .then(rooms => {
            return res.json({
                error: false,
                rooms
            })
        })
        .catch(() => {
            return res.status(400).json({
                error: true,
                message: 'Error: No rooms found'
            })
        })
})

app.post('/registerRoom', async (req, res) => {
    await Room.create(req.body)
        .then(() => {
            res.json({
                error: false,
                message: 'Romm registered successfully'
            })
        })
        .catch(() => {
            return res.status(400).json({
                error: true,
                message: "Error: Couldn't complete room registration"
            })
        })
})

app.post('/createUser', async (req, res) => {
    let dados = req.body

    const user = await User.findOne({
        where: {
            email: dados.email
        }
    })

    if (user) {
        return res.status(400).json({
            error: true,
            message: 'Error: email already registered'
        })
    }

    await User.create(dados)
        .then(() => {
            return res.json({
                error: false,
                message: 'User successfully created'
            })
        })
        .catch(() => {
            return res.status(400).json({
                error: true,
                message: 'Error: Failed to create user'
            })
        })
})

app.post('/validateAccess', async (req, res) => {
    const user = await User.findOne({
        attributes: ['id', 'name'],
        where: {
            email: req.body.email
        }
    })

    if (user === null) {
        return res.status(400).json({
            error: true,
            message: 'Error: User not found'
        })
    }

    return res.json({
        error: false,
        message: 'Successfully logged in',
        user
    })
})

const server = app.listen(8080, () => {
    console.log('Server instanced in Port 8080: http://localhost:8080')
})

io = socket(server, { cors: { origin: '*' } })

io.on('connection', socket => {
    console.log(socket.id)

    socket.on('room_connect', data => {
        socket.join(Number(data))
        console.log('Chosen room: ' + data)
    })

    socket.on('message', data => {
        Message.create({
            message: data.content.message,
            roomId: data.roomId,
            userId: data.content.user.id
        })

        socket.to(Number(data.roomId)).emit('serverMessage', data.content)
        console.log(data)
    })
})
