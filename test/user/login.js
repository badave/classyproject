
var assert = require("assert");
var request = require('supertest');

var app = require('../../app');

describe('user/login', function(){
  describe('post#', function(){
  	var user_1 = { email: 'test@gmail.com', password: 'password' };
  	var user_1_diff_password = { email: 'test@gmail.com', password: 'asdlkfjasdf' };
  	var user_no_email = { password: 'test@gmail.com' };
  	var user_no_password = { email: 'test+1@gmail.com' };


  	it("cannot get /v1/users without being an admin", function(done) {
  		request(app)
  			.get('/v1/users')
  			.set('Accept', 'application/json')
  			.expect(401)
  			.end(function(error, response) {
  				assert.equal(response.body.data, "User required.");
  				done();
  			});
  	});

  	it("cannot get /v1/users/:id without being a user", function(done) {
  		request(app)
  			.get('/v1/users/asdflkj')
  			.expect(401)
  			.end(function(error, response) {
  				assert.equal(response.body.data, "User required.");
  				done();
  			})
  	});

  	it("can post to /v1/users with an email and password", function(done) {
  		request(app)
  			.post('/v1/users/')
  			.send(user_1)
  			.expect(200)
				.end(function(error, response) {
					assert.equal(response.body.data.email, user_1.email);
					assert.equal(response.body.data.password, undefined);
					assert.equal(response.body.data.hash, undefined);
  				done();
  			});
  	});

  	it("should not be able to recreate the same user with a different password", function(done) {
  		request(app)
  			.post('/v1/users')
  			.send(user_1_diff_password)
  			.expect(500)
  			.end(function(error, response) {
  				assert.equal(response.body.data, "Password doesn't match");
  				done();
  			});
  	});

  	it("should not be able to create a user without an email", function(done) {
  		request(app)
  			.post('/v1/users')
  			.send(user_no_email)
  			.expect(500)
  			.end(function(error, response) {
  				assert.equal(response.body.data, "Enter a valid email address");
  				done();
  			});
  	});

  	it("should not be able to create a user without a password", function(done) {
  		request(app)
  			.post('/v1/users')
  			.send(user_no_password)
  			.expect(500)
  			.end(function(error, response) {
  				assert.equal(response.body.data, "Enter a password");
  				done();
  			});
  	});

  	it("should not create a user with no data", function(done) {
  		request(app)
  			.post('/v1/users')
  			.send({})
  			.expect(500)
  			.end(function(error, response) {
  				assert.equal(response.body.data, "Enter a valid email address");
  				done();
  			});
  	});
  })
})
