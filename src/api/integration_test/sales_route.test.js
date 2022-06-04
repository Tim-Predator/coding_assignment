const request = require("supertest");
const app = require('../../config/express.js');
const {Connection} = require('../../config/mongo')

jest.setTimeout(1000*60*2);

describe("Test of geting sales report", () => {
    let connection
    beforeAll(async () => {
        connection = await Connection.open()
    });

    afterAll(async () => {
        Connection.close()
    });

    test("Test of fetching all records via GET /sales/report", (done) => {
        request(app)
        .get("/sales/report")
        .expect("Content-Type", /json/)
        .expect(200)
        .expect((res) => {
            expect(res.body.status).toEqual(200)
            expect(res.body.errno).toEqual(0)
            expect(res.body.success).toEqual(true)
            expect(res.body.message).toEqual('ok')
            expect(Array.isArray(res.body.data)).toBe(true);
        }).end((err, res) => {
            if (err) return done(err);
            return done();
        });
    });

    test("Test of fetching records with a invalid quert type via GET /sales/report?type=abc", (done) => {
        request(app)
        .get("/sales/report?type=abc")
        .expect("Content-Type", /json/)
        .expect(400)
        .expect((res) => {
            expect(res.body.status).toEqual(400)
            expect(res.body.errno).toEqual(40003)
            expect(res.body.success).toEqual(false)
            expect(res.body.message).toEqual('Invalid query date format. Query type must be either \"single\" or \"range\"')
        }).end((err, res) => {
            if (err) return done(err);
            return done();
        });
    });

    test("Test of first inserting records of specific date and then fetch the records by a single date via GET /sales/report?type=single&date=1990-01-01", (done) => {
        request(app)
        .post('/sales/record')
        .attach('file', './samples/sample_8.csv')
        .expect(200)
        .expect((res) => {
            expect(res.body.status).toEqual(200)
            expect(res.body.errno).toEqual(0)
            expect(res.body.success).toEqual(true)
            expect(res.body.message).toEqual('Inserted 3 records')
        }).end((err, res) => {
            if (err) return done(err);

            return request(app)
            .get("/sales/report?type=single&date=1990-01-01")
            .expect("Content-Type", /json/)
            .expect(200)
            .expect((res) => {
                expect(res.body.status).toEqual(200)
                expect(res.body.errno).toEqual(0)
                expect(res.body.success).toEqual(true)
                expect(res.body.message).toEqual('ok')
                expect(Array.isArray(res.body.data)).toBe(true);
                expect(res.body.data.length).toBe(2);
            }).end(async (err, res) => {
                await connection.collection('sales').deleteMany({ USER_NAME:{$in:['TEST NAME 1','TEST NAME 2','TEST NAME 3']}})
                if (err) return done(err);
                return done();
            });
        });
    });

    test("Test of fetching the records by a single date but invalid date format via GET /sales/report?type=single&date=1990/01/01", (done) => {
        request(app)
        .get("/sales/report?type=single&date=1990/01/01")
        .expect("Content-Type", /json/)
        .expect(400)
        .expect((res) => {
            expect(res.body.status).toEqual(400)
            expect(res.body.errno).toEqual(40003)
            expect(res.body.success).toEqual(false)
            expect(res.body.message).toEqual('Invalid query date format. url must contain query key \"date\" with value in format \"yyyy-mm-dd\" when query type = \"single\" ')
        }).end((err, res) => {
            if (err) return done(err);
            return done();
        });
    });

    test("Test of fetching the records by a single date but invalid date format via GET /sales/report?type=single&date=1990-15-15", (done) => {
        request(app)
        .get("/sales/report?type=single&date=1990-15-15")
        .expect("Content-Type", /json/)
        .expect(400)
        .expect((res) => {
            expect(res.body.status).toEqual(400)
            expect(res.body.errno).toEqual(40003)
            expect(res.body.success).toEqual(false)
            expect(res.body.message).toEqual('Invalid query date format. url must contain query key \"date\" with value in format \"yyyy-mm-dd\" when query type = \"single\" ')
        }).end((err, res) => {
            if (err) return done(err);
            return done();
        });
    });

    test("Test of fetching the records by a single date but do not specify the date in the url via GET /sales/report?type=single", (done) => {
        request(app)
        .get("/sales/report?type=single")
        .expect("Content-Type", /json/)
        .expect(400)
        .expect((res) => {
            expect(res.body.status).toEqual(400)
            expect(res.body.errno).toEqual(40003)
            expect(res.body.success).toEqual(false)
            expect(res.body.message).toEqual('Invalid query date format. url must contain query key \"date\" with value in format \"yyyy-mm-dd\" when query type = \"single\" ')
        }).end((err, res) => {
            if (err) return done(err);
            return done();
        });
    });


    test("Test of first inserting records of specific date and then fetch the records by date range via GET /sales/report?type=range&from=1990-01-01&to=from=1991-01-01", (done) => {
        request(app)
        .post('/sales/record')
        .attach('file', './samples/sample_8.csv')
        .expect(200)
        .expect((res) => {
            expect(res.body.status).toEqual(200)
            expect(res.body.errno).toEqual(0)
            expect(res.body.success).toEqual(true)
            expect(res.body.message).toEqual('Inserted 3 records')
        }).end((err, res) => {
            if (err) return done(err);

            return request(app)
            .get("/sales/report?type=range&from=1990-01-01&to=1991-01-01")
            .expect("Content-Type", /json/)
            .expect(200)
            .expect((res) => {
                expect(res.body.status).toEqual(200)
                expect(res.body.errno).toEqual(0)
                expect(res.body.success).toEqual(true)
                expect(res.body.message).toEqual('ok')
                expect(Array.isArray(res.body.data)).toBe(true);
                expect(res.body.data.length).toBe(3);
            }).end(async (err, res) => {
                await connection.collection('sales').deleteMany({ USER_NAME:{$in:['TEST NAME 1','TEST NAME 2','TEST NAME 3']}})
                if (err) return done(err);
                return done();
            });
        });
    });

    test("Test of first inserting many records and then fetch the records by setting limit and skip via GET /sales/report?limit=777&skip=0", (done) => {
        request(app)
        .post('/sales/record')
        .attach('file', './samples/sample_6.csv')
        .expect(200)
        .expect((res) => {
            expect(res.body.status).toEqual(200)
            expect(res.body.errno).toEqual(0)
            expect(res.body.success).toEqual(true)
            expect(res.body.message).toEqual('Inserted 1540 records')
        }).end((err, res) => {
            if (err) return done(err);

            return request(app)
            .get("/sales/report?limit=777&skip=0")
            .expect("Content-Type", /json/)
            .expect(200)
            .expect((res) => {
                expect(res.body.status).toEqual(200)
                expect(res.body.errno).toEqual(0)
                expect(res.body.success).toEqual(true)
                expect(res.body.message).toEqual('ok')
                expect(Array.isArray(res.body.data)).toBe(true);
                expect(res.body.data.length).toBe(777);
                expect(res.body.total).toBe(777);
            }).end(async (err, res) => {
                await connection.collection('sales').deleteMany({ USER_NAME:{$in:['TEST NAME 1','TEST NAME 2','TEST NAME 3']}})
                if (err) return done(err);
                return done();
            });
        });
    });

    test("Test of fetching the records by date range but invalid date format via GET /sales/report?type=range&from=1990/01/01&to=from=1991/01/01", (done) => {
        request(app)
        .get("/sales/report?type=range&from=1990/01/01&to=from=1991/01/01")
        .expect("Content-Type", /json/)
        .expect(400)
        .expect((res) => {
            expect(res.body.status).toEqual(400)
            expect(res.body.errno).toEqual(40003)
            expect(res.body.success).toEqual(false)
            expect(res.body.message).toEqual('Invalid query date format. url must contain query key \"from\" with value in format \"yyyy-mm-dd\" when query type = \"range\"')
        }).end((err, res) => {
            if (err) return done(err);
            return done();
        });
    });

    test("Test of fetching the records by date range but invalid date format via GET /sales/report?type=range&from=1990-01-01&to=from=1991/01/01", (done) => {
        request(app)
        .get("/sales/report?type=range&from=1990-01-01&to=from=1991/01/01")
        .expect("Content-Type", /json/)
        .expect(400)
        .expect((res) => {
            expect(res.body.status).toEqual(400)
            expect(res.body.errno).toEqual(40003)
            expect(res.body.success).toEqual(false)
            expect(res.body.message).toEqual('Invalid query date format. url must contain query key \"to\" with value in format \"yyyy-mm-dd\" when query type = \"range\"')
        }).end((err, res) => {
            if (err) return done(err);
            return done();
        });
    });

    test("Test of fetching the records by date range but missing date information via GET /sales/report?type=range", (done) => {
        request(app)
        .get("/sales/report?type=range")
        .expect("Content-Type", /json/)
        .expect(400)
        .expect((res) => {
            expect(res.body.status).toEqual(400)
            expect(res.body.errno).toEqual(40003)
            expect(res.body.success).toEqual(false)
            expect(res.body.message).toEqual('Invalid query date format. url must contain query key \"from\" with value in format \"yyyy-mm-dd\" when query type = \"range\"')
        }).end((err, res) => {
            if (err) return done(err);
            return done();
        });
    });

});

describe("Test of upload csv files", () => {
    let connection
    beforeAll(async () => {
        connection = await Connection.open()
    });

    afterAll(async () => {
        Connection.close()
    });

    test('Uploads a valid file via POST /sales/record',(done) => {
        request(app)
        .post('/sales/record')
        .attach('file', './samples/sample_1.csv')
        .expect(200)
        .expect((res) => {
            expect(res.body.status).toEqual(200)
            expect(res.body.errno).toEqual(0)
            expect(res.body.success).toEqual(true)
            expect(res.body.message).toEqual('Inserted 2 records')
        }).end(async (err, res) => {
            await connection.collection('sales').deleteMany({ USER_NAME:{$in:['TEST NAME 1','TEST NAME 2']}})
            if (err) return done(err);
            return done();
        });
    });

    test('should throw error when upload nothing via POST /sales/record',(done) => {
        request(app)
        .post('/sales/record')
        .expect(404)
        .expect((res) => {
            expect(res.body.status).toEqual(404)
            expect(res.body.errno).toEqual(40401)
            expect(res.body.success).toEqual(false)
            expect(res.body.message).toEqual('Upload file not found. The upload file must have key = \"file\".')
        }).end(async (err, res) => {
            if (err) return done(err);
            return done();
        });
    });


    test('Uploads a valid file with 1540 records via POST /sales/record',(done) => {
        request(app)
        .post('/sales/record')
        .attach('file', './samples/sample_6.csv')
        .expect(200)
        .expect((res) => {
            expect(res.body.status).toEqual(200)
            expect(res.body.errno).toEqual(0)
            expect(res.body.success).toEqual(true)
            expect(res.body.message).toEqual('Inserted 1540 records')
        }).end(async(err, res) => {
            await connection.collection('sales').deleteMany({ USER_NAME:{$in:['TESTING NAME 1']}})
            if (err) return done(err);
            return done();
        });
    });

    test('Uploads a valid file with 18480 records via POST /sales/record',(done) => {
        request(app)
        .post('/sales/record')
        .attach('file', './samples/sample_9.csv')
        .expect(200)
        .expect((res) => {
            expect(res.body.status).toEqual(200)
            expect(res.body.errno).toEqual(0)
            expect(res.body.success).toEqual(true)
            expect(res.body.message).toEqual('Inserted 18480 records')
        }).end(async(err, res) => {
            await connection.collection('sales').deleteMany({ USER_NAME:{$in:['TESTING NAME 1']}})
            if (err) return done(err);
            return done();
        });
    });

    test('Uploads a invalid file via POST /sales/record',(done) => {
        request(app)
        .post('/sales/record')
        .attach('file', './samples/sample_error_2.csv')
        .expect(400)
        .expect((res) => {
            expect(res.body.status).toEqual(400)
            expect(res.body.errno).toEqual(40002)
            expect(res.body.success).toEqual(false)
            expect(res.body.message).toEqual('Invalid data format. File is not processed. Error occurs at csv line 3. Error: ValidationError: \"SALE_AMOUNT\" must be a number')
        }).end((err, res) => {
            if (err) return done(err);
            return done();
        });
    });

    test('Uploads a valid file but wrong key in the form via POST /sales/record',(done) => {
        request(app)
        .post('/sales/record')
        .attach('wrong_file', './samples/sample_1.csv')
        .expect(404)
        .expect((res) => {
            expect(res.body.status).toEqual(404)
            expect(res.body.errno).toEqual(40401)
            expect(res.body.success).toEqual(false)
            expect(res.body.message).toEqual('Upload file not found. The upload file must have key = \"file\".')
        }).end((err, res) => {
            if (err) return done(err);
            return done();
        });
    });

    test('Uploads a valid file but wrong file type via POST /sales/record',(done) => {
        request(app)
        .post('/sales/record')
        .attach('file', './samples/sample_7.txt')
        .expect(400)
        .expect((res) => {
            expect(res.body.status).toEqual(400)
            expect(res.body.errno).toEqual(40001)
            expect(res.body.success).toEqual(false)
            expect(res.body.message).toEqual('Invalid file format. ')
        }).end((err, res) => {
            if (err) return done(err);
            return done();
        });
    });

});


