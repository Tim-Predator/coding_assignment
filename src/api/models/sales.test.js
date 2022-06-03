const sales = require('./sales')
const {Connection} = require('../../config/mongo')

jest.setTimeout(1000*60*2);

describe('Test of sales validate_sales function',() => {	
	test('should throw ValidationError when try to validate an empty object',()=>{
		expect(()=>{
            sales.validate_sales({})
		}).toThrow("ValidationError");
	})
    test('should throw ValidationError when try to validate an array',()=>{
		expect(()=>{
            sales.validate_sales([])
		}).toThrow("ValidationError");
	})
    test('should throw ValidationError when try to validate a string',()=>{
		expect(()=>{
            sales.validate_sales('123')
		}).toThrow("ValidationError");
	})
    test('should throw ValidationError when try to validate nothing',()=>{
		expect(()=>{
            sales.validate_sales()
		}).toThrow("ValidationError");
	})
    test('should not throw ValidationError',async ()=>{
		expect(()=>{
            sales.validate_sales({
                USER_NAME:"Tom Chan",
                AGE: 11,
                HEIGHT: 120,
                GENDER: 'M',
                SALE_AMOUNT: 10000,
                LAST_PURCHASE_DATE: new Date()
            })
		}).not.toThrow("ValidationError");
	})
    test('should throw ValidationError when USERNAME is missing',()=>{
		expect(()=>{
            sales.validate_sales({
                AGE: 11,
                HEIGHT: 120,
                GENDER: 'M',
                SALE_AMOUNT: 10000,
                LAST_PURCHASE_DATE: new Date()
            })
		}).toThrow("ValidationError");
	})
    test('should throw ValidationError when USERNAME is not a string',()=>{
		expect(()=>{
            sales.validate_sales({
                USER_NAME: 123,
                AGE: 11,
                HEIGHT: 120,
                GENDER: 'M',
                SALE_AMOUNT: 10000,
                LAST_PURCHASE_DATE: new Date()
            })
		}).toThrow("ValidationError");
	})
    test('should throw ValidationError when AGE is missing',()=>{
		expect(()=>{
            sales.validate_sales({
                USER_NAME:"Tom Chan",
                HEIGHT: 120,
                GENDER: 'M',
                SALE_AMOUNT: 10000,
                LAST_PURCHASE_DATE: new Date()
            })
		}).toThrow("ValidationError");
	})
    test('should throw ValidationError when AGE is not an integer',()=>{
		expect(()=>{
            sales.validate_sales({
                USER_NAME:"Tom Chan",
                AGE: 11.2,
                HEIGHT: 120,
                GENDER: 'M',
                SALE_AMOUNT: 10000,
                LAST_PURCHASE_DATE: new Date()
            })
		}).toThrow("ValidationError");
	})
    test('should throw ValidationError when AGE is not positive',()=>{
		expect(()=>{
            sales.validate_sales({
                USER_NAME:"Tom Chan",
                AGE: -11,
                HEIGHT: 120,
                GENDER: 'M',
                SALE_AMOUNT: 10000,
                LAST_PURCHASE_DATE: new Date()
            })
		}).toThrow("ValidationError");
	})
    test('should throw ValidationError when HEIGHT is missing',()=>{
		expect(()=>{
            sales.validate_sales({
                USER_NAME:"Tom Chan",
                AGE: 11,
                GENDER: 'M',
                SALE_AMOUNT: 10000,
                LAST_PURCHASE_DATE: new Date()
            })
		}).toThrow("ValidationError");
	})
    test('should throw ValidationError when HEIGHT is negative',()=>{
		expect(()=>{
            sales.validate_sales({
                USER_NAME:"Tom Chan",
                AGE: 11,
                HEIGHT: -120,
                GENDER: 'M',
                SALE_AMOUNT: 10000,
                LAST_PURCHASE_DATE: new Date()
            })
		}).toThrow("ValidationError");
	})
    test('should throw ValidationError when HEIGHT is not integer but float',()=>{
		expect(()=>{
            sales.validate_sales({
                USER_NAME:"Tom Chan",
                AGE: 11,
                HEIGHT: 120.2,
                GENDER: 'M',
                SALE_AMOUNT: 10000,
                LAST_PURCHASE_DATE: new Date()
            })
		}).toThrow("ValidationError");
	})
    test('should throw ValidationError when HEIGHT is a string',()=>{
		expect(()=>{
            sales.validate_sales({
                USER_NAME:"Tom Chan",
                AGE: 11,
                HEIGHT: '120',
                GENDER: 'M',
                SALE_AMOUNT: 10000,
                LAST_PURCHASE_DATE: new Date()
            })
		}).toThrow("ValidationError");
	})
    test('should throw ValidationError when GENDER is missing',()=>{
		expect(()=>{
            sales.validate_sales({
                USER_NAME:"Tom Chan",
                AGE: 11,
                HEIGHT: 120,
                SALE_AMOUNT: 10000,
                LAST_PURCHASE_DATE: new Date()
            })
		}).toThrow("ValidationError");
	})
    test('should throw ValidationError when GENDER is not M or F',()=>{
		expect(()=>{
            sales.validate_sales({
                USER_NAME:"Tom Chan",
                AGE: 11,
                HEIGHT: 120,
                GENDER: 'A',
                SALE_AMOUNT: 10000,
                LAST_PURCHASE_DATE: new Date()
            })
		}).toThrow("ValidationError");
	})
    test('should throw ValidationError when GENDER is in lower case m',()=>{
		expect(()=>{
            sales.validate_sales({
                USER_NAME:"Tom Chan",
                AGE: 11,
                HEIGHT: 120,
                GENDER: 'm',
                SALE_AMOUNT: 10000,
                LAST_PURCHASE_DATE: new Date()
            })
		}).toThrow("ValidationError");
	})
    test('should throw ValidationError when SALE_AMOUNT is missing',()=>{
		expect(()=>{
            sales.validate_sales({
                USER_NAME:"Tom Chan",
                AGE: 11,
                HEIGHT: 120,
                GENDER: 'M',
                LAST_PURCHASE_DATE: new Date()
            })
		}).toThrow("ValidationError");
	})
    test('should throw ValidationError when SALE_AMOUNT is negative',()=>{
		expect(()=>{
            sales.validate_sales({
                USER_NAME:"Tom Chan",
                AGE: 11,
                HEIGHT: 120,
                GENDER: 'M',
                SALE_AMOUNT: -10000,
                LAST_PURCHASE_DATE: new Date()
            })
		}).toThrow("ValidationError");
	})
    test('should throw ValidationError when SALE_AMOUNT is a string',()=>{
		expect(()=>{
            sales.validate_sales({
                USER_NAME:"Tom Chan",
                AGE: 11,
                HEIGHT: 120,
                GENDER: 'M',
                SALE_AMOUNT: '10000',
                LAST_PURCHASE_DATE: new Date()
            })
		}).toThrow("ValidationError");
	})
    test('should throw ValidationError when LAST_PURCHASE_DATE is missing',()=>{
		expect(()=>{
            sales.validate_sales({
                USER_NAME:"Tom Chan",
                AGE: 11,
                HEIGHT: 120,
                GENDER: 'M',
                SALE_AMOUNT: 10000,
            })
		}).toThrow("ValidationError");
	})
    test('should throw ValidationError when LAST_PURCHASE_DATE is not a date object',()=>{
		expect(()=>{
            sales.validate_sales({
                USER_NAME:"Tom Chan",
                AGE: 11,
                HEIGHT: 120,
                GENDER: 'M',
                SALE_AMOUNT: 10000,
                LAST_PURCHASE_DATE: '2021-02-01'
            })
		}).toThrow("ValidationError");
	})
})


describe('Test of insertMany and find function', () => {
    
    let connection
    beforeAll(async () => {
        connection = await Connection.open()
    });

    afterAll(async () => {
        Connection.close()
    });

    test('should insert a doc into database and find it again', async () => {
        let test_name='Testing Name Here'
        await connection.collection('sales').deleteMany({ USER_NAME:test_name})
        const data = [{
            USER_NAME:test_name,
            AGE: 11,
            HEIGHT: 120,
            GENDER: 'M',
            SALE_AMOUNT: 10000,
            LAST_PURCHASE_DATE: new Date('1992-01-01')
        }];
        await sales.insertMany(data)
        let fetch_result=await sales.find({USER_NAME:test_name})
        await connection.collection('sales').deleteMany({USER_NAME:test_name})
        expect(data).toEqual(fetch_result);
    });

    test('should insert 2 doc into database and find them again', async () => {
        let test_name='Testing Name Here'
        await connection.collection('sales').deleteMany({ USER_NAME:test_name})
        const data = [{
            USER_NAME:test_name,
            AGE: 11,
            HEIGHT: 120,
            GENDER: 'M',
            SALE_AMOUNT: 10000,
            LAST_PURCHASE_DATE: new Date('1992-01-01')
        },{
            USER_NAME:test_name,
            AGE: 28,
            HEIGHT: 150,
            GENDER: 'F',
            SALE_AMOUNT: 2000,
            LAST_PURCHASE_DATE: new Date('1992-04-04')
        }];
        await sales.insertMany(data)
        let fetch_result=await sales.find({USER_NAME:test_name})
        await connection.collection('sales').deleteMany({USER_NAME:test_name})
        expect(data).toEqual(fetch_result);
    });

    test('should throw error when insert an empry array', async () => {
        expect.assertions(1);
        expect(
            sales.insertMany([])
        ).rejects.toEqual(new Error('Invalid insert parameter. Insert array is empty.'))
    });

    test('should throw error when insert something that is not an array', async () => {
        expect.assertions(1);
        expect(
            sales.insertMany({A:123})
        ).rejects.toEqual(new Error('Invalid insert parameter. Insert data must be an array'))
    });

    test('should throw error when insert a record without USER_NAME', async () => {
        expect.assertions(1);
        expect(
            sales.insertMany([{
                AGE: 11,
                HEIGHT: 120,
                GENDER: 'M',
                SALE_AMOUNT: 10000,
                LAST_PURCHASE_DATE: new Date('1992-01-01')
            }])
        ).rejects.toEqual(new Error('ValidationError: "USER_NAME" is required'))    
    });

});