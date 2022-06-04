const { appendFile } = require('fs/promises');
const fs = require('fs');


//generate a file with size > 1GB for testing
const generate=async (path)=>{
    try{
        await fs.unlinkSync(path)
    }catch(e){
        //console.log(e)
    }

    await appendFile(path, 'USER_NAME,AGE,HEIGHT,GENDER,SALE_AMOUNT,LAST_PURCHASE_DATE', 'utf8')
    for(let i =0; i<20000;i++){
        let str=``
        for(let j=0; j<1000;j++)
            str+=`\r\nTEST NAME ${i*1000+j},29,177,M,21312,2020-11-05T13:15:30Z`
        await appendFile(path, str, 'utf8')
    }
    console.log('Large file is saved at: '+ path)
    
}

generate('./samples/one_GB_file.csv')