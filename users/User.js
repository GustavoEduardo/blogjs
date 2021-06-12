const Sequelize = require('sequelize');
const connection  = require('../database/connection');

const User = connection.define('users',{
	name:{
		type: Sequelize.TEXT,
		allowNull: false
	},
	login:{
		type: Sequelize.STRING,
		allowNull: false
	},
	password:{
		type: Sequelize.TEXT,
		allowNull: false
	},
	
});



//User.sync({force: true}).then(() =>{});//se precisar recriar a tabela

module.exports = User;