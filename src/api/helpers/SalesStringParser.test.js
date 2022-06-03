const {SalesStringParser} = require('./SalesStringParser')

 describe('Test of SalesStringParser parsetoJson function',() => {	
	test('should return a sale record json when parsing "John Doe,29,177,M,21312,2020-11-05T13:15:30Z"',()=>{
		let json=SalesStringParser.parsetoJson('John Doe,29,177,M,21312,2020-11-05T13:15:30Z')
        expect(json).toEqual({
            "USER_NAME":'John Doe',
            "AGE": 29,
            "GENDER": "M",
            "HEIGHT": 177,
            "LAST_PURCHASE_DATE": new Date('2020-11-05T13:15:30Z'),
            "SALE_AMOUNT": 21312,
        })
	})

    test('should throw error when parsing "John Doe,29,177,M,21312" where date is missing',()=>{
		expect(()=>{
            let json=SalesStringParser.parsetoJson('John Doe,29,177,M,21312')
        }).toThrow('Invalid string input for SalesStringParser.')
	})

    test('should throw error when parsing a json',()=>{
		expect(()=>{
            let json=SalesStringParser.parsetoJson({})
        }).toThrow('Invalid parameter for SalesStringParser. Input must be a string.')
	})

    test('should throw error when parsing "John Doe,29,177,M,-21312,2020-11-05T13:15:30Z" where SALE_AMOUNT is negative',()=>{
		expect(()=>{
            let json=SalesStringParser.parsetoJson('John Doe,29,177,M,-21312,2020-11-05T13:15:30Z')
        }).toThrow('ValidationError')
	})

    test('should throw error when parsing "John Doe,29,177,s,21312,2020-11-05T13:15:30Z" where GENDER is invalid',()=>{
		expect(()=>{
            let json=SalesStringParser.parsetoJson('John Doe,29,177,s,21312,2020-11-05T13:15:30Z')
        }).toThrow('ValidationError')
	})

    test('should throw error when parsing "John Doe,A,177,M,21312,2020-11-05T13:15:30Z" where AGE is invalid',()=>{
		expect(()=>{
            let json=SalesStringParser.parsetoJson('John Doe,A,177,M,21312,2020-11-05T13:15:30Z')
        }).toThrow('ValidationError')
	})

    test('should throw error when parsing "John Doe,29,177,M,21312,AAA" where LAST_PURCHASE_DATE is invalid',()=>{
		expect(()=>{
            let json=SalesStringParser.parsetoJson('John Doe,29,177,M,-21312,AAA')
        }).toThrow('ValidationError')
	})

})