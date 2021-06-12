const Sequelize = require('sequelize');
const connection  = require('../database/connection');
const Category = require("../categories/Category");

const Article = connection.define('articles',{
	title:{
		type: Sequelize.STRING,
		allowNull: false
	},
	slug:{
		type: Sequelize.TEXT,
		allowNull: false
	},
	body: {
		type: Sequelize.TEXT,
		allowNull: false
	}
});


//relacionamento
Category.hasMany(Article);
Article.belongsTo(Category);



//Article.sync({force: true}).then(() =>{});//se precisar recriar a tabela

module.exports = Article;