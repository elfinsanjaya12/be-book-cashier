const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../app');
const models = require('../app/db/models');
const Op = require('sequelize').Op;

chai.use(chaiHttp);

var token;
var categoryId;
describe('User Signin ', () => {
  describe('Signin', function () {
    it('Should sign in User', function (done) {
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({ email: 'admin@gmail.com', password: 'rahasia' })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.data).to.have.property('token');
          token = res.body.data.token;
          done();
        });
    });
    it('Should Give error when wrong credentials', function (done) {
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({ email: 'admin@gmail.com', password: 'rahasiasalah' })
        .end(function (err, res) {
          expect(res).to.have.status(403);
          expect(res).to.be.json;
          expect(res.body).to.have.property('msg');
          expect(res.body.msg).to.equal('Invalid Credentials');
          done();
        });
    });
  });
});

describe('Categories Crud', function () {
  it('Get all categories', function (done) {
    chai
      .request(app)
      .get('/api/v1/categories')
      .set('Authorization', `Bearer ${token}`)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property('data');
        done();
      });
  });
  it('Create categories', function (done) {
    chai
      .request(app)
      .post('/api/v1/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test name categories',
        user: 1,
      })
      .end(function (err, res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.have.property('data');
        categoryId = res.body.data.id;
        done();
      });
  });
  it('Delete User', function (done) {
    chai
      .request(app)
      .del(`/api/v1/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property('data');
        done();
      });
  });

  it('Should Delete Categories in Database', (done) => {
    models.Category.findOne({
      where: {
        id: { [Op.eq]: categoryId },
      },
    }).then((user) => {
      expect(user).to.equal(null);
      done();
    });
  });
});
