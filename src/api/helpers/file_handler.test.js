const {validate_salecsv_file,insert_salecsv_file}=require('./file_handler')
const sales = require('..//models/sales')
const {Connection} = require('../../config/mongo')


jest.setTimeout(1000*60*2);


describe('Test of validate_salecsv_file function',() => {	
	test('should not throw any error when validate file at ./samples/sample_1.csv',()=>{
        expect(
            validate_salecsv_file('./samples/sample_1.csv')
        ).resolves.toEqual(null)
    })

    test('should throw error when validate file at ./samples/sample_error_2.csv where SALE_AMOUNT at 3rd row is invalid',()=>{
		expect(
            validate_salecsv_file('./samples/sample_error_2.csv')
        ).rejects.toEqual(new Error('Error occurs at csv line 3. Error: ValidationError: "SALE_AMOUNT" must be a number'))
	})

    test('should throw error when validate file a file that does not exist',()=>{
		expect(
            validate_salecsv_file('./samples/abc.csv')
        ).rejects.toEqual(new Error('File not found when try to validate csv file'))
	})

    test('should throw error when the file does not have a header row',()=>{
		expect(
            validate_salecsv_file('./samples/sample_error_3.csv')
        ).rejects.toEqual(new Error('Invalid header in CSV file'))
	})

    test('should throw error when a row is in invalid format',()=>{
		expect(
            validate_salecsv_file('./samples/sample_error_4.csv')
        ).rejects.toEqual(new Error('Error occurs at csv line 3. Error: Invalid string input for SalesStringParser. '))
	})
})

describe('Test of insert_salecsv_file function',() => {	
    let connection
    beforeAll(async () => {
        connection = await Connection.open()
    });

    afterAll(async () => {
        Connection.close()
    });

    test('should insert 2 records into database and able to find them again', async () => {
        await connection.collection('sales').deleteMany({USER_NAME:{$in:['TESTING NAME 1','TESTING NAME 2']}})
        let count= await insert_salecsv_file('./samples/sample_5.csv')
        expect(count).toEqual(2);

        const data = [{
            USER_NAME:'TESTING NAME 1',
            AGE: 29,
            HEIGHT: 177,
            GENDER: 'M',
            SALE_AMOUNT: 21312,
            LAST_PURCHASE_DATE: new Date('2020-11-05T13:15:30Z')
        },{
            USER_NAME:'TESTING NAME 2',
            AGE: 32,
            HEIGHT: 187,
            GENDER: 'F',
            SALE_AMOUNT: 5342,
            LAST_PURCHASE_DATE: new Date('2019-12-05T13:15:30+08:00')
        }];
        let fetch_result=await sales.find({USER_NAME:{$in:['TESTING NAME 1','TESTING NAME 2']}})
        for(let i of fetch_result)
            delete i._id
        await connection.collection('sales').deleteMany({USER_NAME:{$in:['TESTING NAME 1','TESTING NAME 2']}})
        expect(data).toEqual(fetch_result);
    });

    test('should insert 1540 records into database', async () => {
        await connection.collection('sales').deleteMany({USER_NAME:{$in:['TESTING NAME 1']}})
        let count= await insert_salecsv_file('./samples/sample_6.csv') 
        expect(count).toEqual(1540);
        let fetch_result=await sales.find({USER_NAME:{$in:['TESTING NAME 1']}},0,2000)
        expect(fetch_result.length).toEqual(1540);
        await connection.collection('sales').deleteMany({USER_NAME:{$in:['TESTING NAME 1']}})
       
    });

    test('should throw error when try to insert a file that does not exist',()=>{
		expect(
            insert_salecsv_file('./samples/abc.csv')
        ).rejects.toEqual(new Error('File not found when try to insert csv data'))
	})
})