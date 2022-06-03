const { validate } = require('node-cron')
const {Connection}= require('../../config/mongo')
const Joi = require('joi').extend(require('@joi/date'));

setTimeout(async ()=>{
    let connection = await Connection.open()
    connection.collection('sales').createIndex({ LAST_PURCHASE_DATE: 1 },function(err,result) { 
        if(err){console.log('set sales index error:' +err.toString())}
    });
},10000)


const schema = Joi.object({
    
    USER_NAME: Joi.string()
        .min(1)
        .max(30)
        .required(),

    AGE: Joi.number()
        .integer()
        .min(1)
        .max(120)
        .required(),
    
    HEIGHT: Joi.number()
        .integer()
        .min(1)
        .max(300)
        .required(),

    GENDER: Joi.string()
        .valid('M','F')
        .required(),

    SALE_AMOUNT: Joi.number()
        .min(0)
        .required(),

    LAST_PURCHASE_DATE: Joi.date()
        .required()
    
}).strict()

var validate_sales=(record)=>{
    if(!record)throw new Error('ValidationError: record is not a json')
    let res=schema.validate(record)
    if(res.error)
        throw new Error( res.error.toString())
}

var insertMany=(data)=>{
    return new Promise(async (resolve,reject)=>{
        if(!Array.isArray(data))
            return reject(new Error('Invalid insert parameter. Insert data must be an array'))
        if(data.length===0)
            return reject(new Error('Invalid insert parameter. Insert array is empty.'))
        
        try{
            for(let single_record of data)
                validate_sales(single_record)
            let connection = await Connection.open()
            let res= await connection.collection('sales').insertMany(data)
            return resolve(res)
        }catch(e){
            return reject(e)
        }
    })
}

var find=(query={},skip=0,limit=1000)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            let connection = await Connection.open()
            connection.collection('sales').aggregate([ 
                {$match: query},
                {$skip: skip},
                {$limit: limit}
            ]).toArray((err, items) => {
                if (err) return reject(err)
                else return resolve(items)
            });
        }catch(e){
            return reject(e)
        }
    })
}

module.exports = {
    insertMany: insertMany,
    find: find,
    validate_sales: validate_sales
}