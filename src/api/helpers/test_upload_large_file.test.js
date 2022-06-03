const request = require("supertest");
const app = require('../../config/express.js');
const {Connection} = require('../../config/mongo')

jest.setTimeout(1000*60*40);

describe.skip("Test of upload large files", () => {
//describe("Test of upload large files", () => {      //use this line if want to test large file insert
    let connection
    beforeAll(async () => {
        console.log('Start: '+ new Date())
        connection = await Connection.open()
    });

    afterAll(async () => {
        Connection.close()
    });
    test('Test of uploading a 1GB file via POST /sales/record',(done) => {
        request(app)
        .post('/sales/record')
        .attach('file', './samples/one_GB_file.csv')
        .expect(200)
        .expect((res) => {
            expect(res.body.status).toEqual(200)
            expect(res.body.errno).toEqual(0)
            expect(res.body.success).toEqual(true)
            expect(res.body.message).toEqual('Inserted 20000000 records')
        }).end(async (err, res) => {
            console.log('End: '+ new Date())
            await connection.collection('sales').deleteMany({ USER_NAME:{$regex : "TEST NAME"}})
            if (err) return done(err);
            return done();
        });
    });
});