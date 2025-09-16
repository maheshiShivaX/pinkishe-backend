const { Sequelize } = require('sequelize');






//padtrack server
// const sequelize = new Sequelize('padtrack_pinkishedb', 'padtrack_padtrack', 'g%y#U[^%B6?X', {
//     host: 'localhost',
//     dialect: 'mysql',
// });




//local
// const sequelize = new Sequelize('demo', 'root', 'Root@1234', {
//     host: 'localhost',
//     dialect: 'mysql',
// });

const sequelize = new Sequelize('pinkshedb', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});






sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });


module.exports = sequelize;
