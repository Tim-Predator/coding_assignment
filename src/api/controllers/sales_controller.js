const { sendError } = require('../helpers/error_handler')
const fs = require('fs');
const sales = require('../models/sales')
const {validate_salecsv_file,insert_salecsv_file}= require('../helpers/file_handler')
const {is_valid_date_string} = require('../helpers/date_util')



exports.record=async (req,res,next)=>{
    if(!res.locals.filename){
        return sendError(40401,req,res,next)
    }
    if (!fs.existsSync(res.locals.filename)) {
        return sendError(40401,req,res,next)
    }

    //loop through the file line by line. If any row or data format is invalid, do not process the file.
    try{
        //console.log('start validate file: ' + new Date())
        await validate_salecsv_file(res.locals.filename)
        //console.log('end validate file: ' + new Date())
    }catch(e){
        return sendError(40002,req,res,next,e.message)
    }

    //read and insert the record to database
    let total_inserted=0
    try{
        //console.log('start insert data: ' + new Date())
        total_inserted= await insert_salecsv_file(res.locals.filename)
        //console.log('end insert data: ' + new Date())
    }catch(e){
        return sendError(50003,req,res,next,e.toString())
    }

    res.json({
        status:200,
        errno:0,
        success: true,
        message: `Inserted ${total_inserted} records`,
    })
}

exports.report=async (req,res,next)=>{
    let query={}
    let skip=parseInt(req.query.skip, 10)||0
	let limit=parseInt(req.query.limit, 10)||1000

    if(req.query.type==='single'){
        if(!is_valid_date_string(req.query.date)){
            return sendError(40003,req,res,next,'url must contain query key "date" with value in format "yyyy-mm-dd" when query type = "single" ')
        }
        let date=new Date(req.query.date)
        let start=date
        start.setHours(0);
        start.setMinutes(0);
        start.setSeconds(0);
        let end = new Date(start)
        end.setDate(start.getDate()+1);
        query.LAST_PURCHASE_DATE={$gte:start,$lte:end}
    }else if(req.query.type==='range'){
        if(!is_valid_date_string(req.query.from)){
            return sendError(40003,req,res,next,'url must contain query key "from" with value in format "yyyy-mm-dd" when query type = "range"')
        }
        if(!is_valid_date_string(req.query.to)){
            return sendError(40003,req,res,next,'url must contain query key "to" with value in format "yyyy-mm-dd" when query type = "range"')
        }
        let start=new Date(req.query.from)
        start.setHours(0);
        start.setMinutes(0);
        start.setSeconds(0);
        let end=new Date(req.query.to)
        end.setHours(23);
        end.setMinutes(59);
        end.setSeconds(59);
        query.LAST_PURCHASE_DATE={$gte:start,$lte:end}
    }else if(req.query.type){
        return sendError(40003,req,res,next,'Query type must be either "single" or "range"')
    }
    let result
    try{
        result=await sales.find(query,skip,limit)
    }catch(e){
        return sendError(50004,req,res,next,e.toString())
    }

	res.json({
        status:200,
        errno:0,
        success:true,
        message:'ok',
        data:result,
        total:result.length,
    })
}
