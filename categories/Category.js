const Sequelize = require('sequelize');
const connection  = require('../database/connection');

const Category = connection.define('categories',{
	title:{
		type: Sequelize.STRING,
		allowNull: false
	},
	slug:{
		type: Sequelize.TEXT,
		allowNull: false
	}
});


//Category.sync({force: true}).then(() =>{}); //se precisar recriar a tabela

module.exports = Category;