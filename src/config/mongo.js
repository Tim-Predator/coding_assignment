const MongoClient = require('mongodb').MongoClient;
const vars = require('./vars');

class Connection {
    static async open() {
        if (this.db) return this.db
        this.client=await MongoClient.connect(this.url, this.options)
        this.db = this.client.db(vars.MONGODB_NAME)
        return this.db
    }
    static async close(){
        if(this.client){
            this.client.close()
            this.client=null
            this.db=null
        }
    }
}

Connection.url = `mongodb://${vars.MONGODB_IP}:${vars.MONGODB_PORT}`;
Connection.option={   
    useNewUrlParser: true,
    useUnifiedTopology: true
}

module.exports= { Connection }