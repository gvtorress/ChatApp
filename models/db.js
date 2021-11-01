const Sequelize = require('sequelize')

const sequelize = new Sequelize('celke', 'root', 'Sxf1234%', {
    host: 'localhost',
    dialect: 'mysql'
})

sequelize
    .authenticate()
    .then(() => {
        console.log('Database Connected')
    })
    .catch(() => {
        console.log('Error: Failed to connect to the database')
    })

module.exports = sequelize
