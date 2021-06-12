const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');
const adminAuth = require('../middlewares/adminAuth');
//session no index. É global para a aplicação e com o explress-session é salva por padrão na memoria ram do servidor


//pagina de login
router.get("/login", (req, res) =>{

	res.render("admin/users/login");
});


//Autenticação de usuario
router.post("/authenticate", (req, res) =>{

	var login = req.body.login;
	var password = req.body.password;


	User.findOne({ where: {login: login}}).then(user =>{

		if(user != undefined){//se existir um usuario

			console.log("Login:   " +user.login + " Nome: " +user.name);
			//validar senha
			var correct = bcrypt.compareSync(password, user.password);

			if (correct) {
				req.session.user = {
					id: user.id,
					name: user.name,
					login: user.login
				}
				//res.json(req.session.user);
				res.redirect("/admin/articles")
			}else{
				res.redirect("/login");
			}
		}else{
			res.redirect("/login");
		}
	});
});


//logout
router.get("/logout", (req, res) => {

	req.session.user = undefined;

	res.redirect("/");
});



//Lista de usuarios
router.get("/admin/users", adminAuth, (rec,res) =>{

	res.render("admin/users/index");

});


//cadastrar novo usuario
router.get("/admin/users/new", adminAuth, (rec,res) =>{

	res.render("admin/users/new");

});


//salva o novo usuario no banco de dados
router.post("/users/create", adminAuth,(rec,res) =>{

	var name = rec.body.name;
	var login = rec.body.login;
	var password = rec.body.password;


	var salt = bcrypt.genSaltSync(10); //"sal" para incrementar o hash de senha com bcryptjs
	var hash = bcrypt.hashSync(password, salt);//gerando o hash da senha


	User.findOne({
		where: {
			login: login
		}
	}).then(user =>{

		if (user) {

			res.send("Usuario já existe no banco de dados!")

		}else{

			User.create({
				name: name,
				login: login,
				password: hash

			}).then(() => {
				res.redirect('/')
			}).catch((err) => {
				res.redirect('/')

			});

		}


	});

	

});



module.exports = router;