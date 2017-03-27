const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, closeServer, runServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Recipes', function(){
	before(function(){
		return runServer();
	});

	after(function(){
		return closeServer();
	});

	it('should list recipes on GET requests', function(){
		return chai.request(app)
		.get('/recipes')
		.then(function(res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a('array');
			res.body.should.have.length.of.at.least(1);

			res.body.forEach(function(item){
				item.should.be.a('object');
				item.should.include.keys('id', 'name', 'ingredients');	
			});
		});
	});

	it('should add a recipe on POST request',function(){
		const newRecipe = {
			name: 'meatloaf', ingredients: ['ground beef', 'eggs']
		};
		return chai.request(app)
		.post('/recipes')
		.send(newRecipe)
		.then(function(res){
			res.should.have.status(201);
			res.should.be.json;
			res.body.should.be.a('object');
			res.body.should.include.keys('id', 'name', 'ingredients');
			res.body.name.should.equal(newRecipe.name);
			res.body.ingredients.should.be.a('array');
			res.body.ingredients.should.include.members(newRecipe.ingredients);
		});
	});

	it('should update recipes on PUT request', function(){
		const updateRecipe = {
			name: 'foo',
			ingredients: ['bizz', 'bang']
		};

	return chai.request(app)
	.get('/recipes')
	.then(function(res){
		updateRecipe.id = res.body[0].id;

		return chai.request(app)
		.put(`/recipes/${updateRecipe.id}`)
		.send(updateRecipe)
	})
	.then(function(res){
		res.should.be.a('object');
		res.body.should.include.keys('id', 'name', 'ingredients');
		res.body.name.should.equal(updateRecipe.name);
		res.body.id.should.equal(updateRecipe.id);
		res.body.ingredients.should.include.members(updateRecipe.ingredients);
		});
	});

	it('should delete recipes on DELETE request', function(){
		return chai.request(app)
		.get('/recipes')
		.then(function(res){
			return chai.request(app)
				.delete(`/recipes/${res.body[0].id}`)
		})
		.then(function(res){
			res.should.have.status(204);
		});
	});
});
















