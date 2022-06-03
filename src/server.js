const vars = require('./config/vars');
const app = require('./config/express');
const cron = require('node-cron');
const request = require('request')

//trigger data feed every hour at 0 minute
var options = {
    uri: `http://some-external-server-url-to-trigger-data-feed-in`,
    method: 'POST',
    headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer sometoken here`
    },
    'body':JSON.stringify({ somekey:'some-value'}),
    rejectUnauthorized: false,
};
cron.schedule('0 * * * *', () => {
    console.log('Triggering data feed in....')
    request(options, async (err, resp, body)=> {
        if(err)console.log(err)
    })
});



const start = () => {
    try {
        app.listen(vars.PORT,()=>{
            console.log(`[${vars.ENV}] Express Server Runing on port ${vars.PORT}`)
        })
    } catch (err) {
      console.error(err);
      process.exit();
    }
};

start()

module.exports =app;