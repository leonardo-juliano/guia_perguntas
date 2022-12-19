const Sequelize = require("sequelize");

const connection = new Sequelize('guiaperguntas','root','123456',{
    host: 'localhost', //aonde a aplicação esta rodando
    dialect: 'mysql' //tipo de banco de dados 
});

module.exports = connection;