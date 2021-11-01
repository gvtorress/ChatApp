const Sequelize = require('sequelize')
const db = require('./db')
const User = require('./user')
const Room = require('./room')

const Message = db.define('messages', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    message: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    roomId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

Message.belongsTo(User, { foreignKey: 'userId', allowNull: false })
Message.belongsTo(Room, { foreignKey: 'roomId', allowNull: false })

// Message.sync({ alter: true })

// Message.sync()

module.exports = Message
