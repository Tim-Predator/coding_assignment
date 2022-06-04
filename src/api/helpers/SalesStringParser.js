const sales = require('../models/sales')
class SalesStringParser{
    static parsetoJson(str){
        if(typeof str != 'string')
            throw new Error('Invalid parameter for SalesStringParser. Input must be a string.')
        let arr=str.split(',')
        if(arr.length!==6){
            throw new Error('Invalid string input for SalesStringParser. ')
        }
        let json = {
            USER_NAME:arr[0],
            AGE: Number(arr[1]),
            HEIGHT: Number(arr[2]),
            GENDER: arr[3].toUpperCase(),
            SALE_AMOUNT: Number(arr[4]),
            LAST_PURCHASE_DATE: new Date(arr[5])
        }
        sales.validate_sales(json)
        return json
    }
    
}

module.exports= { SalesStringParser }