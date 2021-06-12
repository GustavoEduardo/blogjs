const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('../articles/Article');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');


//Lista os artigos para o admin
router.get('/admin/articles', adminAuth, (rec, res) =>{

	Article.findAll({
		include:[{model: Category}],//para fazer o join article.category.title
		order:[
			['id','DESC']
		]
	}).then(articles=>{
		res.render("admin/articles/index",{articles: articles});	
	});	
});

router.get('/admin/articles/new',(rec, res) =>{

	Category.findAll().then(categories=>{

		res.render("admin/articles/new",{categories: categories});
	});
	
});

//Salva um novo artigo
router.post("/articles/save", adminAuth, (req, res)=>{

	var title = req.body.title;
	var body = req.body.body;
	var category = req.body.category;

	Article.create({
		title: title,
		slug: slugify(title),
		body: body,
		categoryId: category
	}).then(()=>{
		res.redirect("/admin/articles");
	});

});

//Deleta um Artigo
router.post("/articles/delete", adminAuth, (req, res) => {
	 var id = req.body.id;//input escondido

	 if(id != undefined){
	 	if(!isNaN(id)){

	 		Article.destroy({
	 			where: {
	 				id: id
	 			}
	 		}).then(() => res.redirect("/admin/articles"));
	 		
	 	}else{//se não for um numero
	 		res.redirect("/admin/articles")	

	 	}

	 }else{//null
	 	res.redirect("/admin/articles")
	 }

});


//Le um artigo
router.get("/article/:slug",(req, res) => {

	 var slug = req.params.slug;	  	

 	Article.findOne({
 		where: {slug: slug}
 	}).then(article =>{

 		if (article == undefined) {
 			res.redirect("/")
 		}else{
 			res.render("article",{article: article});
 		}
		
	}).catch(err=>{
 		res.redirect("/")
 	});

});



//Editar artigo
router.get("/admin/articles/edit/:id", adminAuth, (req, res) => {

	var id = req.params.id;

	if(isNaN(id)){
		res.redirect("/admin/articles");
	}

	//procura pela primary key = parametro
	Article.findByPk(id).then(article =>{
		if(article != undefined){

			Category.findAll().then(categories=>{
				res.render("admin/articles/edit",{article: article, categories: categories});
			});
		}else{
			res.redirect("/admin/articles");
		}
	}).catch(erro => {
		res.redirect("/admin/articles");
	})

});


//Edita o artigo no banco
router.post("/articles/update", adminAuth, (req, res) =>{

	var id = req.body.id;
	var title = req.body.title;
	var body = req.body.body;
	var category = req.body.category;

	Article.update({
		title: title,
		slug: slugify(title),
		body:body,
		categoryId: category

	},
	{where: {id: id}

	}).then(()=>{
		res.redirect("/admin/articles");
	}).catch(err =>{
		res.redirect("/")
	})

});


//Paginação de artigos
router.get("/articles/page/:num",(req, res) =>{
	var page = req. params.num;
	var offset = 0;

	if(isNaN(page) || page == 1){
		offset = 0;
	}else{
		offset = (parseInt(page) -1) * 6;
	}

	Article.findAndCountAll({
		limit: 6,
		offset: offset,
		order:[
			['id','DESC']
		]		
		
	}).then(articles =>{

		var next;
		if(offset + 6 >= articles.count){
			next = false;
		}else{
			next = true;
		}

		var result = {
			articles: articles,
			next: next,
			page: parseInt(page)
		}


		Category.findAll().then(categories=>{

			res.render("admin/articles/page",{result: result, categories: categories})

		});

		
	})

});


module.exports = router;
