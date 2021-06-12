const express = require('express');
const app = express();
const bodyParser  = require('body-parser');
const connection  = require("./database/connection");
const session = require("express-session");

const categoriesController = require("./categories/categoriesController");
const articlesController = require("./articles/articlesController");
const usersController = require("./users/usersController");

const Article = require("./articles/Article");
const Category = require("./categories/Category")
const User = require("./users/User")


//connection 
connection
	.authenticate()
	.then(() => {
		console.log('Conexão feita com o banco de dados.')
	})
	.catch((err) => {
		console.log(err)
	})	


app.set('view engine', 'ejs');
app.use(express.static("public"));

//session
app.use(session({
	secret: "az319kjudd894kid", cookie: {maxAge: 3000000}
}))

//body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//rotas

//pagina Home
app.get('/', (req, res) => {


	Article.findAll({
		order:[
			['id','DESC']
		],
		limit: 6
	}).then(articles =>{

		Category.findAll().then(categories =>{

			res.render("index",{articles: articles, categories: categories});
		});

			
	});
	
});


//filtra artigos por categoria
app.get("/category/:slug",(req, res)=>{

	var slug = req.params.slug;

	Category.findOne({//para filtrar os artigos dessa categoria
		where: {
			slug: slug
		},
		include: [{model: Article}],//enchergo categoryId na tabela articles no banco
		order:[
			['id','DESC']
		]
	}).then( category =>{
		if(category != undefined){

			Category.findAll().then(categories =>{//para o navcategories
				res.render('articles_by_category',{articles: category.articles, categories: categories, category: category });// category.articles é o join
			});
		}else{
			res.redirect("/");
		}
	}).catch( err =>{
		res.redirect("/");
	});

});



app.use('/',categoriesController);

app.use('/',articlesController);

app.use('/',usersController);






//Iniciando o servidor
app.listen(8080,(err) =>{
	if(err){
		console.log(err)
	}else{
		console.log("Servidor iniciado com sucesso.")
	}
});