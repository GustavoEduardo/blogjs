const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');



//cadastrar nova categoria
router.get("/admin/categories/new", adminAuth,  (req, res) => {

	res.render("admin/categories/new");

});

//salvar nova categoria
router.post("/categories/save", adminAuth, (req, res) => {
	var title = req.body.title;
	if(title != undefined){

		Category.create({
			title: title,
			slug: slugify(title)
		}).then(() => {
			res.redirect("/admin/categories")
		})

	}else{
		res.redirect("/admin/categories/new")
	}
	

});

//Lista de categorias
router.get("/admin/categories", adminAuth, (req, res) => {
	Category.findAll().then(categories =>{
		res.render("admin/categories/index",{categories});
	});
});

//Deletar categoria
router.post("/categories/delete", adminAuth, (req, res) => {
	 var id = req.body.id;//input escondido

	 if(id != undefined){
	 	if(!isNaN(id)){

	 		Category.destroy({
	 			where: {
	 				id: id
	 			}
	 		}).then(() => res.redirect("/admin/categories"));
	 		
	 	}else{//se não for um numero
	 		res.redirect("/admin/categories")	

	 	}

	 }else{//null
	 	res.redirect("/admin/categories")
	 }

});

//Editar categoria
router.get("/admin/categories/edit/:id", adminAuth, (req, res) => {

	var id = req.params.id;

	if(isNaN(id)){
		res.redirect("/admin/categories");
	}

	//procura pela primary key = parametro
	Category.findByPk(id).then(category =>{
		if(category != undefined){
			res.render("admin/categories/edit",{category: category});
		}else{
			res.redirect("/admin/categories");
		}
	}).catch(erro => {
		res.redirect("/admin/categories");
	})

});


//Edita a categoria no banco
router.post("/categories/update", adminAuth, (req, res) =>{

	var id = req.body.id;
	var title = req.body.title;

	Category.update({title: title, slug: slugify(title)},{
		where: {id: id}
	}).then(()=>{
		res.redirect("/admin/categories");
	})

});


module.exports = router;