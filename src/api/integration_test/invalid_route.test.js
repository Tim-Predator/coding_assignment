const request = require("supertest");
const app = require('../../config/express.js');

describe("Test of invalid request", () => {
    test("Test of fetching records with a wrong request method via POST /sales/report", (done) => {
        request(app)
        .post("/sales/report")
        .expect("Content-Type", /json/)
        .expect(404)
        .expect((res) => {
            expect(res.body.status).toEqual(404)
            expect(res.body.errno).toEqual(40400)
            expect(res.body.success).toEqual(false)
            expect(res.body.message).toEqual('Not found/ Invalid URL')
        }).end((err, res) => {
            if (err) return done(err);
            return done();
        });
    });

    test("Test of uploading records with a wrong request method via GET /sales/report", (done) => {
        request(app)
        .get('/sales/record')
        .attach('file', './samples/sample_1.csv')
        .expect(404)
        .expect((res) => {
            expect(res.body.status).toEqual(404)
            expect(res.body.errno).toEqual(40400)
            expect(res.body.success).toEqual(false)
            expect(res.body.message).toEqual('Not found/ Invalid URL')
        }).end((err, res) => {
            if (err) return done(err);
            return done();
        });
    });

    test("Test of fetching getting the records with a wrong url via GET /sales/report/123", (done) => {
        request(app)
        .get("/sales/record/123")
        .expect("Content-Type", /json/)
        .expect(404)
        .expect((res) => {
            expect(res.body.status).toEqual(404)
            expect(res.body.errno).toEqual(40400)
            expect(res.body.success).toEqual(false)
            expect(res.body.message).toEqual('Not found/ Invalid URL')
        }).end((err, res) => {
            if (err) return done(err);
            return done();
        });
    });

    test("Test of invalid url via GET /123443525", (done) => {
        request(app)
        .get("/123443525")
        .expect("Content-Type", /json/)
        .expect(404)
        .expect((res) => {
            expect(res.body.status).toEqual(404)
            expect(res.body.errno).toEqual(40400)
            expect(res.body.success).toEqual(false)
            expect(res.body.message).toEqual('Not found/ Invalid URL')
        }).end((err, res) => {
            if (err) return done(err);
            return done();
        });
    });
});