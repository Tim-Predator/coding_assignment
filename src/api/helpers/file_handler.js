const path = require('path');             
const fs = require('fs');
const { sendError } = require('./error_handler')
const readline = require('readline');
const {SalesStringParser} = require('./SalesStringParser')
const sales = require('../models/sales')

const uploadPath ='./temp/'

/*This middleware does the following thing
1. Check if the request contains a file with the specified key
2. Check the file type 
3. Save the file to the "temp" directory
4. Save the filename of the uploaded file into res.locals.filename
5. Delete the file when the request is completed 
*/
exports.save_temp_file=( key, type, deleteFile=true )=>(req,res,next)=>{

    if (req.busboy) {

        let isUploaded=false
        let errorCode=null

        req.busboy.on('file', (name, file, info) => {

            //If an error already occured, do nothing and return
            if(errorCode){
                file.resume();
                return
            }

            //Validate if the uploaded file has the specified key 
            if(name!==key){
                file.resume();
                return
            }

            // Validate file mimetype
            if(info.mimeType !== type){
                file.resume();
                errorCode = 40001
                return
            }

            let filename = Date.now()+'_'+Math.floor(Math.random()*10000000)+'_'+info.filename

            // Create a write stream of the new file
            const fstream = fs.createWriteStream(path.join(uploadPath, filename));

            // Pipe it trough
            file.pipe(fstream);

            // On finish of the upload
            file.on('close', () => {
                isUploaded=true
                res.locals.filename= path.join(uploadPath, filename)
            });

            // On Error of the uploading file
            file.on('error', (err)=> {
                console.log(`Upload of ${filename} error: ${err}`)
                return sendError(50002,req,res,next, err.message) 
            });

            // Delete the file when the response is sent
            res.on('close', (err)=> {
                if(deleteFile){
                    try{
                        fs.unlinkSync(path.join(uploadPath, filename));
                    }catch(e){
                        console.log(e)
                    }
                }
            });
        });

        req.busboy.on('finish', function() {
            if(errorCode){
                return sendError(errorCode,req,res,next) 
            }else if(!isUploaded){
                return sendError(40401,req,res,next,`The upload file must have key = "${key}".`) 
            }
            next()
        });

        req.pipe(req.busboy);
    }else{
        return sendError(40401,req,res,next,`The upload file must have key = "${key}".`) 
    }
}

exports.validate_salecsv_file=(filepath)=>{
    return new Promise(async(resolve,reject)=>{
        if (!fs.existsSync(filepath)) {
            return reject(new Error('File not found when try to validate csv file'))
        }
        let fileStream = fs.createReadStream(filepath);
        let rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        let count=1
        for await (const line of rl) {
            if(count===1){
                if(line !== 'USER_NAME,AGE,HEIGHT,GENDER,SALE_AMOUNT,LAST_PURCHASE_DATE'){
                    return reject(new Error('Invalid header in CSV file'))
                }
            }else{
                try{
                    SalesStringParser.parsetoJson(line)
                }catch(e){
                    return reject(new Error(`Error occurs at csv line ${count}. ` + e.toString()))
                }
            }
            count++
        }
        fileStream.close()
        resolve(null)
    })
}

exports.insert_salecsv_file=async (filepath)=>{
    return new Promise(async(resolve,reject)=>{
        if (!fs.existsSync(filepath)) {
            return reject(new Error('File not found when try to insert csv data'))
        }
        let fileStream = fs.createReadStream(filepath);
        let rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        let count=1
        let insert_array=[]
        let total_inserted=0


       

        for await (const line of rl) {
            if(count!==1){
                let json=SalesStringParser.parsetoJson(line)
                insert_array.push(json)
            }

            if(count%100000===0){
                let result=await sales.insertMany(insert_array)
                total_inserted+=result.insertedCount
                insert_array=[]
            }
            count++
        }
        if(insert_array.length>0){
            let result=await sales.insertMany(insert_array)
            total_inserted+=result.insertedCount
        }
        fileStream.close()
        resolve(total_inserted)
    });
}
