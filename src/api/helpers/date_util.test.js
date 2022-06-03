const {is_valid_date_string} = require('./date_util')

describe("Test of validating yyyy-mm-dd format using is_valid_date_string function", () => {
    test('should return true for 2020-01-01',()=>{
        let result=is_valid_date_string('2020-01-01')
		expect(result).toBe(true);
	})
    test('should return false for 2020/01/01',()=>{
        let result=is_valid_date_string('2020/01/01')
		expect(result).toBe(false);
	})
    test('should return false for 01-01-2020',()=>{
        let result=is_valid_date_string('01-01-2020')
		expect(result).toBe(false);
	})
    test('should return false for 2020-13-01',()=>{
        let result=is_valid_date_string('2020-13-01')
		expect(result).toBe(false);
	})
    test('should return false for 2020-02-30',()=>{
        let result=is_valid_date_string('2020-02-30')
		expect(result).toBe(false);
	})
    test('should return false for 02-01-01',()=>{
        let result=is_valid_date_string('02-01-01')
		expect(result).toBe(false);
	})
    test('should return true for 2020-02-29 (leap year)',()=>{
        let result=is_valid_date_string('2020-02-29')
		expect(result).toBe(true);
	})
    test('should return true for 2021-02-29 (non leap year)',()=>{
        let result=is_valid_date_string('2021-02-29')
		expect(result).toBe(false);
	})
})