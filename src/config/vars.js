module.exports = {
    ENV: process.env.NODE_ENV||'development',
    PORT: process.env.PORT ? Number(process.env.PORT) : 5001,
    MONGODB_IP: process.env.MONGODB_IP||'Manulife:ManulifeMOVE@localhost',
    MONGODB_PORT:  process.env.MONGODB_PORT||27017,
    MONGODB_NAME: process.env.MONGODB_NAME||'ManulifeMOVE_TEST',
}