const Sequelize = require('sequelize')
const db = require('./db')

const Room = db.define('rooms', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

// Room.sync()

module.exports = Room
