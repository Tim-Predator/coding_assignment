const error_dictionary={
    40000: {status:400, message: 'Bad Request. '},
    40001: {status:400, message: 'Invalid file format. '},
    40002: {status:400, message: 'Invalid data format. File is not processed. '},
    40003: {status:400, message: 'Invalid query date format. '},
    40004: {status:400, message: 'Invalid query type. '},
    40400: {status:404, message: "Not Found. "},
    40401: {status:404, message: "Upload file not found. "},
    50001: {status:500, message: "Server error. Unknown error code. "},
    50002: {status:500, message: "Upload file error. "},
    50003: {status:500, message: "Process file error. "},
    50004: {status:500, message: "Fetch record error. "},
}

exports.sendError=(code,req,res,next,message=null)=>{
    let response
    if(error_dictionary[code]){
        response={
            status: error_dictionary[code].status,
            errno:code,
            success: false,
            message: error_dictionary[code].message + (message||''),
        }
    }else{
        response={
            status: 500,
            errno: 50001,
            success: false,
            message: "Server error. Unknown error code. "+(message||''),
        }
    }

    res.status(response.status);
    res.json(response);
    res.end();

}