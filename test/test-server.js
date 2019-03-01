const chai = require('chai');
const chaiHttp = require('chai-http');

 const { app, runServer, closeServer } = require('../server');
 const {TEST_DATABASE_URL} = require('../config');
 const should = chai.should();
 chai.use(chaiHttp);

 describe('API', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });
  after(function(){
    return closeServer()
  });

   it('should 200 on GET requests', function() {
     return chai.request(app)
       .get('/api/projects')
       .then(function(res) {
         res.should.have.status(200);
         res.should.be.json;
       });
   });
 });